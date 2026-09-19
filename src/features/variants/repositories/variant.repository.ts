import { db } from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma";
import { retireUniqueValue } from "@/lib/utils/retire-unique-value";
import type {
  GetAdminVariantsParams,
  AdminVariantListParams,
  AdminVariantsCountResponse,
} from "../types";

export const variantInclude = Prisma.validator<Prisma.ProductVariantInclude>()({
  item: {
    select: {
      id: true,
      uuid: true,
      name: true,
      slug: true,
      isActive: true,
      deleted_at: true,
      base_price: true,
      style: {
        select: {
          id: true,
          uuid: true,
          name: true,
          slug: true,
          productId: true,
          isActive: true,
          deleted_at: true,
          veg_type: true,
          product: {
            select: {
              id: true,
              uuid: true,
              name: true,
              slug: true,
              isActive: true,
              deleted_at: true,
            },
          },
        },
      },
    },
  },
  product_variant_images: {
    where: { is_active: true },
    select: {
      uuid: true,
      image_url: true,
      is_primary: true,
      sort_order: true,
    },
    orderBy: [{ is_primary: "desc" }, { sort_order: "asc" }],
  },
  variant_unit_prices: {
    where: { deleted_at: null },
    include: {
      product_units: {
        select: {
          id: true,
          uuid: true,
          name: true,
          code: true,
          type: true,
          is_active: true,
        },
      },
      attribute_value: {
        select: { uuid: true, value: true },
      },
      inventories: {
        select: {
          id: true,
          quantity_available: true,
          quantity_reserved: true,
        },
      },
    },
    orderBy: [{ is_default: "desc" }, { createdAt: "asc" }],
  },
  variant_attribute_values: {
    include: {
      product_attributes: { select: { uuid: true, name: true, slug: true } },
      attribute_values: { select: { uuid: true, value: true, price_adjustment: true } },
    },
  },
});

export const variantRepository = {
  async findByUuid(uuid: string) {
    return db.productVariant.findFirst({
      where: { uuid, deleted_at: null },
      include: variantInclude,
    });
  },

  async findById(id: number | bigint) {
    return db.productVariant.findFirst({
      where: { id: BigInt(id), deleted_at: null },
      include: variantInclude,
    });
  },

  async findBySlug(slug: string, excludeUuid?: string) {
    return db.productVariant.findFirst({
      where: {
        slug,
        deleted_at: null,
        ...(excludeUuid ? { uuid: { not: excludeUuid } } : {}),
      },
      include: variantInclude,
    });
  },

  async findAdminAll(
    params: GetAdminVariantsParams = {},
    itemId?: bigint
  ) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;

    const where: Prisma.ProductVariantWhereInput = {
      deleted_at: null,
      ...(itemId ? { itemId } : {}),
      item: {
        deleted_at: null,
      },
    };

    if (typeof params.isActive === "boolean") {
      where.isActive = params.isActive;
    }

    if (params.search) {
      where.OR = [
        { variant_name: { contains: params.search } },
        { variant_unit_prices: { some: { sku: { contains: params.search } } } },
        { item: { name: { contains: params.search } } },
      ];
    }

    const [data, total] = await Promise.all([
      db.productVariant.findMany({
        where,
        include: variantInclude,
        orderBy: [{ createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.productVariant.count({ where }),
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

  async buildAdminVariantsBaseWhere(
    params: AdminVariantListParams
  ): Promise<Prisma.ProductVariantWhereInput> {
    const where: Prisma.ProductVariantWhereInput = {
      deleted_at: null,
      item: {
        deleted_at: null,
      },
    };

    // Filter by Product UUIDs (traverses item.product, since these params
    // still carry Product uuids the way they did before the Item level existed)
    const allProductIds = [...(params.productIds || [])];
    if (params.productId && !allProductIds.includes(params.productId)) {
      allProductIds.push(params.productId);
    }
    if (allProductIds.length > 0) {
      const matchingProducts = await db.product.findMany({
        where: { uuid: { in: allProductIds }, deleted_at: null },
        select: { id: true },
      });
      where.item = {
        ...(where.item as Prisma.ItemWhereInput),
        style: { productId: { in: matchingProducts.map((p) => p.id) } },
      };
    }

    const itemStyleWhere = (): Prisma.StyleWhereInput =>
      ((where.item as Prisma.ItemWhereInput)?.style as Prisma.StyleWhereInput) ?? {};
    const itemStyleProductWhere = (): Prisma.ProductWhereInput =>
      (itemStyleWhere().product as Prisma.ProductWhereInput) ?? {};

    // Filter by Brand UUIDs
    if (params.brandIds && params.brandIds.length > 0) {
      const matchingBrands = await db.productBrand.findMany({
        where: { uuid: { in: params.brandIds }, deleted_at: null },
        select: { id: true },
      });
      where.item = {
        ...(where.item as Prisma.ItemWhereInput),
        style: {
          ...itemStyleWhere(),
          product: { ...itemStyleProductWhere(), brandId: { in: matchingBrands.map((b) => b.id) } },
        },
      };
    }

    // Filter by Category UUIDs
    if (params.categoryIds && params.categoryIds.length > 0) {
      const matchingCategories = await db.productCategory.findMany({
        where: { uuid: { in: params.categoryIds }, deleted_at: null },
        select: { id: true },
      });
      where.item = {
        ...(where.item as Prisma.ItemWhereInput),
        style: {
          ...itemStyleWhere(),
          product: {
            ...itemStyleProductWhere(),
            categoryId: { in: matchingCategories.map((c) => c.id) },
          },
        },
      };
    }

    // Filter by Measurement Types (weight, volume, count) - now via unit prices
    if (params.measurementTypes && params.measurementTypes.length > 0) {
      const existingSome = where.variant_unit_prices
        ?.some as Prisma.VariantUnitPriceWhereInput | undefined;
      where.variant_unit_prices = {
        ...where.variant_unit_prices,
        some: {
          ...existingSome,
          product_units: { type: { in: params.measurementTypes } },
        },
      };
    }

    // Filter by Unit UUIDs
    if (params.unitIds && params.unitIds.length > 0) {
      const matchingUnits = await db.product_units.findMany({
        where: { uuid: { in: params.unitIds } },
        select: { id: true },
      });
      const existingSome = where.variant_unit_prices
        ?.some as Prisma.VariantUnitPriceWhereInput | undefined;
      where.variant_unit_prices = {
        ...where.variant_unit_prices,
        some: {
          ...existingSome,
          unit_id: { in: matchingUnits.map((u) => u.id) },
        },
      };
    }

    // Search filter across variantName, SKU (via unit prices), and item/product name
    if (params.search) {
      where.OR = [
        { variant_name: { contains: params.search } },
        { variant_unit_prices: { some: { sku: { contains: params.search } } } },
        { item: { name: { contains: params.search } } },
        { item: { style: { product: { name: { contains: params.search } } } } },
      ];
    }

    // Price range filter (via unit prices' base_price)
    const minP = params.minPrice ?? undefined;
    const maxP = params.maxPrice ?? undefined;
    if ((minP !== undefined && minP !== null) || (maxP !== undefined && maxP !== null)) {
      const minVal = minP ?? 0;
      const maxVal = maxP ?? Number.MAX_SAFE_INTEGER;

      const priceCondition = {
        variant_unit_prices: {
          some: { base_price: { gte: minVal, lte: maxVal } },
        },
      };

      if (where.OR) {
        where.AND = [priceCondition];
      } else {
        Object.assign(where, priceCondition);
      }
    }

    return where;
  },

  async buildAdminVariantsWhere(
    params: AdminVariantListParams
  ): Promise<Prisma.ProductVariantWhereInput> {
    const where = await this.buildAdminVariantsBaseWhere(params);

    if (typeof params.isActive === "boolean") {
      where.isActive = params.isActive;
    }

    if (typeof params.outOfStock === "boolean") {
      where.out_of_stock = params.outOfStock;
    }

    if (params.vegType) {
      where.item = {
        ...(where.item as Prisma.ItemWhereInput),
        style: {
          ...((where.item as Prisma.ItemWhereInput)?.style as Prisma.StyleWhereInput),
          veg_type: params.vegType,
        },
      };
    }

    return where;
  },

  async countAdminVariants(
    params: AdminVariantListParams
  ): Promise<AdminVariantsCountResponse> {
    const baseWhere = await this.buildAdminVariantsBaseWhere(params);
    const withItemVegType = (vegType: string): Prisma.ProductVariantWhereInput => ({
      ...baseWhere,
      item: {
        ...(baseWhere.item as Prisma.ItemWhereInput),
        style: {
          ...((baseWhere.item as Prisma.ItemWhereInput)?.style as Prisma.StyleWhereInput),
          veg_type: vegType as never,
        },
      },
    });

    const [
      active,
      inactive,
      inStock,
      outOfStock,
      veg,
      nonveg,
      vegan,
      na,
      all,
    ] = await Promise.all([
      db.productVariant.count({ where: { ...baseWhere, isActive: true } }),
      db.productVariant.count({ where: { ...baseWhere, isActive: false } }),
      db.productVariant.count({ where: { ...baseWhere, out_of_stock: false } }),
      db.productVariant.count({ where: { ...baseWhere, out_of_stock: true } }),
      db.productVariant.count({ where: withItemVegType("veg") }),
      db.productVariant.count({ where: withItemVegType("nonveg") }),
      db.productVariant.count({ where: withItemVegType("vegan") }),
      db.productVariant.count({ where: withItemVegType("na") }),
      db.productVariant.count({ where: baseWhere }),
    ]);

    return {
      active,
      inactive,
      inStock,
      outOfStock,
      veg,
      nonveg,
      vegan,
      na,
      all,
    };
  },

  async findAdminVariants(params: AdminVariantListParams) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? params.limit ?? 20;

    const where = await this.buildAdminVariantsWhere(params);

    // Sorting
    const sortOrder = params.sortOrder ?? "desc";
    let orderBy: Prisma.ProductVariantOrderByWithRelationInput = { createdAt: sortOrder };

    if (params.sortBy === "variantName") {
      orderBy = { variant_name: sortOrder };
    } else if (params.sortBy === "productName") {
      orderBy = { item: { name: sortOrder } };
    } else if (params.sortBy === "createdAt") {
      orderBy = { createdAt: sortOrder };
    } else if (params.sortBy === "updatedAt") {
      orderBy = { updatedAt: sortOrder };
    }
    // Note: sortBy "sku" / "basePrice" / "salePrice" now live on VariantUnitPrice
    // (a one-to-many relation) and cannot be expressed as a simple orderBy on
    // ProductVariant. Callers needing that ordering should sort client-side or
    // query variant-unit-prices directly via variantUnitPriceRepository.

    const [data, total] = await Promise.all([
      db.productVariant.findMany({
        where,
        include: variantInclude,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.productVariant.count({ where }),
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

  async findAdminAllByItemId(
    itemId: bigint,
    params: GetAdminVariantsParams = {}
  ) {
    return this.findAdminAll(params, itemId);
  },

  async create(data: Prisma.ProductVariantUncheckedCreateInput) {
    return db.productVariant.create({
      data,
      include: variantInclude,
    });
  },

  async updateByUuid(
    uuid: string,
    data: Prisma.ProductVariantUncheckedUpdateInput,
    _adminId?: bigint | null
  ) {
    const existing = await db.productVariant.findFirst({
      where: { uuid, deleted_at: null },
    });
    if (!existing) return null;

    return db.productVariant.update({
      where: { id: existing.id },
      data,
      include: variantInclude,
    });
  },

  async softDeleteByUuid(uuid: string, adminId?: bigint | null) {
    const existing = await this.findByUuid(uuid);
    if (!existing) return null;

    return db.productVariant.update({
      where: { id: existing.id },
      data: {
        isActive: false,
        deleted_at: new Date(),
        // Free the unique slug so a new variant can reuse it; the archived row
        // keeps a namespaced slug instead of blocking the insert.
        ...(existing.slug
          ? { slug: retireUniqueValue(existing.slug, existing.id, 255) }
          : {}),
        ...(adminId ? { updated_by: adminId } : {}),
      },
    });
  },

  /**
   * Every other active Color variant of this Item, each with its sorted set of
   * attribute_value ids - used to reject a new/edited variant that would
   * duplicate an existing attribute combination (e.g. two "Red" variants).
   * Two different Items of the same Product may legitimately share a color.
   */
  async findAttributeSetsForItem(
    itemId: bigint,
    excludeVariantId?: bigint
  ): Promise<Array<{ variantId: bigint; attributeValueIds: bigint[] }>> {
    const variants = await db.productVariant.findMany({
      where: {
        itemId,
        deleted_at: null,
        ...(excludeVariantId ? { id: { not: excludeVariantId } } : {}),
      },
      select: {
        id: true,
        variant_attribute_values: { select: { attribute_value_id: true } },
      },
    });

    return variants.map((v) => ({
      variantId: v.id,
      attributeValueIds: v.variant_attribute_values
        .map((vav) => vav.attribute_value_id)
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)),
    }));
  },

  /**
   * Replaces this variant's non-Size attribute values (e.g. Fabric=Cotton) with the
   * given set. One attribute can hold only one value per variant, enforced by
   * resolving each value's parent attribute and replacing the whole set atomically.
   */
  async setAttributeValuesForVariant(
    variantId: bigint,
    attributeValueInternalIds: bigint[]
  ) {
    const entries =
      attributeValueInternalIds.length > 0
        ? await db.attributeValue.findMany({
            where: { id: { in: attributeValueInternalIds } },
            select: { id: true, attributeId: true },
          })
        : [];

    await db.$transaction([
      db.variant_attribute_values.deleteMany({ where: { variant_id: variantId } }),
      ...(entries.length
        ? [
            db.variant_attribute_values.createMany({
              data: entries.map((entry) => ({
                variant_id: variantId,
                attribute_id: entry.attributeId,
                attribute_value_id: entry.id,
              })),
            }),
          ]
        : []),
    ]);
  },
};
