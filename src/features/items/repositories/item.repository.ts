import crypto from "crypto";
import { db } from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma";
import { retireUniqueValue } from "@/lib/utils/retire-unique-value";
import type { GetAdminItemsParams } from "../types";

export const itemInclude = Prisma.validator<Prisma.ItemInclude>()({
  style: {
    select: {
      id: true,
      uuid: true,
      name: true,
      slug: true,
      isActive: true,
      deleted_at: true,
      productId: true,
      product: { select: { uuid: true } },
    },
  },
  variants: {
    where: { deleted_at: null },
    select: {
      id: true,
      color_name: true,
      variant_unit_prices: {
        where: { deleted_at: null },
        select: {
          base_price: true,
          inventories: { select: { quantity_available: true } },
        },
      },
    },
  },
  item_attribute_values: {
    select: {
      attribute_values: {
        select: { uuid: true, value: true, color_hex: true, image_url: true },
      },
      product_attributes: {
        select: {
          id: true,
          uuid: true,
          name: true,
          slug: true,
          type: true,
          multiple_selection: true,
        },
      },
    },
  },
});

export const itemRepository = {
  async findByUuid(uuid: string) {
    return db.item.findFirst({
      where: { uuid, deleted_at: null },
      include: itemInclude,
    });
  },

  async findById(id: number | bigint) {
    return db.item.findFirst({
      where: { id: BigInt(id), deleted_at: null },
      include: itemInclude,
    });
  },

  /**
   * Duplicate lookups below deliberately match ACTIVE rows only (deleted_at:
   * null). A soft-deleted item keeps its history but must not block an admin
   * from creating a fresh item with the same code/SKU - softDeleteByUuid
   * namespaces the archived values so the UNIQUE index agrees.
   */
  async findBySlug(slug: string, excludeUuid?: string) {
    return db.item.findFirst({
      where: {
        slug,
        deleted_at: null,
        ...(excludeUuid ? { uuid: { not: excludeUuid } } : {}),
      },
    });
  },

  async findBySku(sku: string, excludeUuid?: string) {
    return db.item.findFirst({
      where: {
        sku,
        deleted_at: null,
        ...(excludeUuid ? { uuid: { not: excludeUuid } } : {}),
      },
    });
  },

  async findAllByStyleId(styleId: bigint, params: GetAdminItemsParams = {}) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;

    const where: Prisma.ItemWhereInput = {
      styleId,
      deleted_at: null,
    };

    if (typeof params.isActive === "boolean") {
      where.isActive = params.isActive;
    }

    if (params.search) {
      where.name = { contains: params.search };
    }

    const [data, total] = await Promise.all([
      db.item.findMany({
        where,
        include: itemInclude,
        orderBy: [{ is_default: "desc" }, { createdAt: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.item.count({ where }),
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

  async create(data: Prisma.ItemUncheckedCreateInput) {
    return db.item.create({
      data,
      include: itemInclude,
    });
  },

  /**
   * The Item's price is the one price every Color x Size under it sells at.
   * When it changes, every size row still on the old Item price moves with it
   * (with a price-history entry); rows the admin deliberately priced
   * differently on the size table keep their own price.
   */
  async updateByUuid(
    uuid: string,
    data: Prisma.ItemUncheckedUpdateInput,
    adminId?: bigint | null
  ) {
    const existing = await db.item.findFirst({ where: { uuid, deleted_at: null } });
    if (!existing) return null;

    const oldPrice = Number(existing.base_price);
    const newPrice = data.base_price !== undefined ? Number(data.base_price) : oldPrice;

    return db.$transaction(async (tx) => {
      if (newPrice !== oldPrice) {
        const followers = await tx.variantUnitPrice.findMany({
          where: {
            deleted_at: null,
            base_price: oldPrice,
            variant: { itemId: existing.id, deleted_at: null },
          },
          select: { id: true },
        });
        if (followers.length > 0) {
          const now = new Date();
          await tx.variant_price_history.createMany({
            data: followers.map((row) => ({
              uuid: crypto.randomUUID(),
              variant_unit_price_id: row.id,
              old_base_price: oldPrice,
              new_base_price: newPrice,
              changed_at: now,
              is_active: true,
              created_by: adminId ?? null,
              updated_by: adminId ?? null,
            })),
          });
          await tx.variantUnitPrice.updateMany({
            where: { id: { in: followers.map((row) => row.id) } },
            data: { base_price: newPrice, ...(adminId ? { updated_by: adminId } : {}) },
          });
        }
      }

      return tx.item.update({
        where: { id: existing.id },
        data,
        include: itemInclude,
      });
    });
  },

  async softDeleteByUuid(uuid: string, adminId?: bigint | null) {
    const existing = await this.findByUuid(uuid);
    if (!existing) return null;

    return db.item.update({
      where: { id: existing.id },
      data: {
        isActive: false,
        deleted_at: new Date(),
        // Free the unique slug/sku so a new item can reuse them; the archived
        // row keeps namespaced values instead of blocking the insert.
        slug: retireUniqueValue(existing.slug, existing.id, 220),
        ...(existing.sku
          ? { sku: retireUniqueValue(existing.sku, existing.id, 100) }
          : {}),
        ...(adminId ? { updated_by: adminId } : {}),
      },
    });
  },

  async countActiveByStyleId(styleId: bigint): Promise<number> {
    return db.item.count({ where: { styleId, deleted_at: null } });
  },
};
