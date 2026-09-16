import crypto from "crypto";
import { db } from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma";
import type { GetAdminAttributesParams } from "../types";

const attributeInclude = Prisma.validator<Prisma.ProductAttributeInclude>()({
  values: { where: { is_active: true }, orderBy: { value: "asc" } },
  category_attributes: { select: { category_id: true } },
});

export const attributeRepository = {
  async findByUuid(uuid: string) {
    return db.productAttribute.findFirst({
      where: { uuid, is_active: true },
      include: attributeInclude,
    });
  },

  async findById(id: number | bigint) {
    return db.productAttribute.findFirst({
      where: { id: BigInt(id), is_active: true },
      include: attributeInclude,
    });
  },

  async findBySlug(slug: string, excludeUuid?: string) {
    return db.productAttribute.findFirst({
      where: {
        slug,
        is_active: true,
        ...(excludeUuid ? { uuid: { not: excludeUuid } } : {}),
      },
    });
  },

  async findByName(name: string, excludeUuid?: string) {
    return db.productAttribute.findFirst({
      where: {
        name,
        is_active: true,
        ...(excludeUuid ? { uuid: { not: excludeUuid } } : {}),
      },
    });
  },

  async findAdminAll(params: GetAdminAttributesParams = {}) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;

    const where: Prisma.ProductAttributeWhereInput = { is_active: true };

    if (params.search) {
      where.OR = [
        { name: { contains: params.search } },
        { slug: { contains: params.search } },
      ];
    }

    if (params.categoryId) {
      const numericId = Number(params.categoryId);
      const category = await db.productCategory.findFirst({
        where: {
          OR: [
            { uuid: params.categoryId },
            ...(Number.isFinite(numericId) ? [{ id: BigInt(numericId) }] : []),
          ],
        },
        select: { id: true },
      });
      if (category) {
        where.category_attributes = { some: { category_id: category.id } };
      }
    }

    const [data, total] = await Promise.all([
      db.productAttribute.findMany({
        where,
        include: attributeInclude,
        orderBy: [{ name: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.productAttribute.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit: pageSize,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async create(data: Prisma.ProductAttributeUncheckedCreateInput) {
    return db.productAttribute.create({ data, include: attributeInclude });
  },

  async updateByUuid(uuid: string, data: Prisma.ProductAttributeUncheckedUpdateInput) {
    const existing = await db.productAttribute.findFirst({ where: { uuid } });
    if (!existing) return null;

    return db.productAttribute.update({
      where: { id: existing.id },
      data,
      include: attributeInclude,
    });
  },

  async softDeleteByUuid(uuid: string, adminId?: bigint | null) {
    const existing = await db.productAttribute.findFirst({ where: { uuid } });
    if (!existing) return null;

    const suffix = `-deleted-${existing.id}`;
    const slug = `${existing.slug.slice(0, 120 - suffix.length)}${suffix}`;

    return db.productAttribute.update({
      where: { id: existing.id },
      data: {
        is_active: false,
        // Free up the unique slug so a new attribute can reuse it; the
        // deleted row keeps a namespaced slug instead of blocking inserts.
        slug,
        ...(adminId ? { updated_by: adminId } : {}),
      },
    });
  },

  async createValue(
    attributeId: bigint,
    value: string,
    adminId?: bigint | null,
    priceAdjustment?: number
  ) {
    return db.attributeValue.create({
      data: {
        uuid: crypto.randomUUID(),
        attributeId,
        value,
        price_adjustment: priceAdjustment ?? 0,
        created_by: adminId ?? undefined,
        updated_by: adminId ?? undefined,
      },
    });
  },

  async findValueByUuid(uuid: string) {
    return db.attributeValue.findFirst({ where: { uuid, is_active: true } });
  },

  async updateValueByUuid(
    uuid: string,
    value: string | undefined,
    adminId?: bigint | null,
    priceAdjustment?: number
  ) {
    const existing = await db.attributeValue.findFirst({ where: { uuid } });
    if (!existing) return null;

    return db.attributeValue.update({
      where: { id: existing.id },
      data: {
        ...(value !== undefined ? { value } : {}),
        ...(priceAdjustment !== undefined ? { price_adjustment: priceAdjustment } : {}),
        updated_by: adminId ?? undefined,
      },
    });
  },

  async softDeleteValueByUuid(uuid: string, adminId?: bigint | null) {
    const existing = await db.attributeValue.findFirst({ where: { uuid } });
    if (!existing) return null;

    return db.attributeValue.update({
      where: { id: existing.id },
      data: { is_active: false, updated_by: adminId ?? undefined },
    });
  },

  async setCategoriesForAttribute(attributeId: bigint, categoryInternalIds: bigint[]) {
    await db.$transaction([
      db.category_attributes.deleteMany({ where: { attribute_id: attributeId } }),
      ...(categoryInternalIds.length
        ? [
            db.category_attributes.createMany({
              data: categoryInternalIds.map((category_id) => ({
                category_id,
                attribute_id: attributeId,
              })),
            }),
          ]
        : []),
    ]);
  },

  async findCategoryAttributesForCategory(categoryInternalId: bigint) {
    return db.category_attributes.findMany({
      where: { category_id: categoryInternalId },
      orderBy: { sort_order: "asc" },
      include: {
        product_attributes: {
          include: {
            values: { where: { is_active: true }, orderBy: { value: "asc" } },
          },
        },
      },
    });
  },
};
