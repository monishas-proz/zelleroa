import crypto from "crypto";
import { ApiError } from "@/lib/api/api-error";
import { attributeRepository } from "../repositories/attribute.repository";
import { userRepository } from "@/features/users/repositories/user.repository";
import { db } from "@/lib/db/prisma";
import type { AttributeListItem, GetAdminAttributesParams } from "../types";
import type {
  CreateAdminAttributeInput,
  UpdateAdminAttributeInput,
  SetAttributeCategoriesInput,
} from "../validations/admin-attribute.schema";

type AttributeWithRelations = {
  id: bigint;
  uuid: string | null;
  name: string;
  slug: string;
  is_active: boolean;
  createdAt: Date;
  values: {
    id: bigint;
    uuid: string | null;
    value: string;
    is_active: boolean;
    createdAt: Date;
    price_adjustment: unknown;
  }[];
  category_attributes: { category_id: bigint }[];
};

async function resolveCategoryInternalIds(categoryIds: string[]): Promise<bigint[]> {
  if (!categoryIds.length) return [];
  const numericIds = categoryIds
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id));

  const categories = await db.productCategory.findMany({
    where: {
      OR: [
        { uuid: { in: categoryIds } },
        ...(numericIds.length ? [{ id: { in: numericIds.map((n) => BigInt(n)) } }] : []),
      ],
    },
    select: { id: true },
  });

  return categories.map((c) => c.id);
}

function formatAttribute(attribute: AttributeWithRelations): AttributeListItem {
  const attributeUuid = attribute.uuid || String(attribute.id);
  return {
    id: attributeUuid,
    name: attribute.name,
    slug: attribute.slug,
    isActive: Boolean(attribute.is_active),
    createdAt: attribute.createdAt,
    values: attribute.values.map((v) => ({
      id: v.uuid || String(v.id),
      value: v.value,
      isActive: Boolean(v.is_active),
      createdAt: v.createdAt,
      priceAdjustment: Number(v.price_adjustment ?? 0),
    })),
    categoryIds: attribute.category_attributes.map((ca) => String(ca.category_id)),
    _count: { values: attribute.values.length },
  };
}

async function getAdminInternalId(email?: string): Promise<bigint | null> {
  if (!email) return null;
  const user = await userRepository.findByEmail(email);
  if (!user) return null;
  return BigInt(user.internalId || user.id);
}

export const attributeService = {
  async createAdminAttribute(
    data: CreateAdminAttributeInput,
    adminEmail?: string
  ): Promise<AttributeListItem> {
    const adminId = await getAdminInternalId(adminEmail);

    const existingSlug = await attributeRepository.findBySlug(data.slug);
    if (existingSlug) {
      throw ApiError.conflict(`An attribute with code '${data.slug}' already exists`);
    }

    const existingName = await attributeRepository.findByName(data.name);
    if (existingName) {
      throw ApiError.conflict(`An attribute with name '${data.name}' already exists`);
    }

    const created = await attributeRepository.create({
      uuid: crypto.randomUUID(),
      name: data.name,
      slug: data.slug,
      is_active: true,
      created_by: adminId,
      updated_by: adminId,
    });

    if (data.values?.length) {
      await Promise.all(
        data.values.map((value) =>
          attributeRepository.createValue(created.id, value, adminId)
        )
      );
    }

    if (data.categoryIds?.length) {
      const categoryInternalIds = await resolveCategoryInternalIds(data.categoryIds);
      await attributeRepository.setCategoriesForAttribute(created.id, categoryInternalIds);
    }

    const withRelations = await attributeRepository.findByUuid(created.uuid!);
    return formatAttribute(withRelations as AttributeWithRelations);
  },

  async getAdminAttributes(params: GetAdminAttributesParams = {}) {
    const result = await attributeRepository.findAdminAll(params);
    return {
      data: result.data.map((a) => formatAttribute(a as AttributeWithRelations)),
      meta: result.meta,
    };
  },

  async getAdminAttributeByUuid(uuid: string): Promise<AttributeListItem> {
    const attribute = await attributeRepository.findByUuid(uuid);
    if (!attribute) {
      throw ApiError.notFound("Attribute not found");
    }
    return formatAttribute(attribute as AttributeWithRelations);
  },

  async updateAdminAttribute(
    uuid: string,
    data: UpdateAdminAttributeInput,
    adminEmail?: string
  ): Promise<AttributeListItem> {
    const existing = await attributeRepository.findByUuid(uuid);
    if (!existing) {
      throw ApiError.notFound("Attribute not found");
    }

    const adminId = await getAdminInternalId(adminEmail);
    const updateData: Record<string, unknown> = {};
    if (adminId) updateData.updated_by = adminId;

    if (data.slug !== undefined && data.slug !== existing.slug) {
      const slugConflict = await attributeRepository.findBySlug(data.slug, uuid);
      if (slugConflict) {
        throw ApiError.conflict(`An attribute with code '${data.slug}' already exists`);
      }
      updateData.slug = data.slug;
    }

    if (data.name !== undefined && data.name !== existing.name) {
      const nameConflict = await attributeRepository.findByName(data.name, uuid);
      if (nameConflict) {
        throw ApiError.conflict(`An attribute with name '${data.name}' already exists`);
      }
      updateData.name = data.name;
    }

    const updated = await attributeRepository.updateByUuid(uuid, updateData);
    if (!updated) {
      throw ApiError.notFound("Attribute not found");
    }

    return formatAttribute(updated as AttributeWithRelations);
  },

  async deleteAdminAttribute(uuid: string, adminEmail?: string) {
    const existing = await attributeRepository.findByUuid(uuid);
    if (!existing) {
      throw ApiError.notFound("Attribute not found");
    }

    const adminId = await getAdminInternalId(adminEmail);
    await attributeRepository.softDeleteByUuid(uuid, adminId);

    return { success: true, message: "Attribute deleted successfully" };
  },

  async addValue(
    attributeUuid: string,
    value: string,
    adminEmail?: string,
    priceAdjustment?: number
  ) {
    const attribute = await attributeRepository.findByUuid(attributeUuid);
    if (!attribute) {
      throw ApiError.notFound("Attribute not found");
    }

    const adminId = await getAdminInternalId(adminEmail);
    const duplicate = attribute.values.find(
      (v) => v.value.toLowerCase() === value.toLowerCase()
    );
    if (duplicate) {
      throw ApiError.conflict(`Value '${value}' already exists for this attribute`);
    }

    await attributeRepository.createValue(attribute.id, value, adminId, priceAdjustment);
    const refreshed = await attributeRepository.findByUuid(attributeUuid);
    return formatAttribute(refreshed as AttributeWithRelations);
  },

  async updateValue(
    attributeUuid: string,
    valueUuid: string,
    value: string | undefined,
    adminEmail?: string,
    priceAdjustment?: number
  ) {
    const attribute = await attributeRepository.findByUuid(attributeUuid);
    if (!attribute) {
      throw ApiError.notFound("Attribute not found");
    }

    const adminId = await getAdminInternalId(adminEmail);
    const updated = await attributeRepository.updateValueByUuid(
      valueUuid,
      value,
      adminId,
      priceAdjustment
    );
    if (!updated) {
      throw ApiError.notFound("Attribute value not found");
    }

    const refreshed = await attributeRepository.findByUuid(attributeUuid);
    return formatAttribute(refreshed as AttributeWithRelations);
  },

  async deleteValue(attributeUuid: string, valueUuid: string, adminEmail?: string) {
    const adminId = await getAdminInternalId(adminEmail);
    const deleted = await attributeRepository.softDeleteValueByUuid(valueUuid, adminId);
    if (!deleted) {
      throw ApiError.notFound("Attribute value not found");
    }

    const refreshed = await attributeRepository.findByUuid(attributeUuid);
    if (!refreshed) {
      throw ApiError.notFound("Attribute not found");
    }
    return formatAttribute(refreshed as AttributeWithRelations);
  },

  async setCategories(attributeUuid: string, data: SetAttributeCategoriesInput) {
    const attribute = await attributeRepository.findByUuid(attributeUuid);
    if (!attribute) {
      throw ApiError.notFound("Attribute not found");
    }

    const categoryInternalIds = await resolveCategoryInternalIds(data.categoryIds);
    await attributeRepository.setCategoriesForAttribute(attribute.id, categoryInternalIds);

    const refreshed = await attributeRepository.findByUuid(attributeUuid);
    return formatAttribute(refreshed as AttributeWithRelations);
  },

  /** Used by the product form to render only the attributes relevant to a category. */
  async getAttributesForCategory(categoryUuidOrId: string) {
    const numericId = Number(categoryUuidOrId);
    const category = await db.productCategory.findFirst({
      where: {
        OR: [
          { uuid: categoryUuidOrId },
          ...(Number.isFinite(numericId) ? [{ id: BigInt(numericId) }] : []),
        ],
      },
      select: { id: true },
    });
    if (!category) return [];

    const links = await attributeRepository.findCategoryAttributesForCategory(category.id);
    return links.map((link) => ({
      id: link.product_attributes.uuid || String(link.product_attributes.id),
      name: link.product_attributes.name,
      slug: link.product_attributes.slug,
      isRequired: link.is_required,
      values: link.product_attributes.values.map((v) => ({
        id: v.uuid || String(v.id),
        value: v.value,
        isActive: Boolean(v.is_active),
        createdAt: v.createdAt,
        priceAdjustment: Number(v.price_adjustment ?? 0),
      })),
    }));
  },
};
