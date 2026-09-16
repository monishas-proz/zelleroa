import { db } from "@/lib/db/prisma";

export const recentlyViewedRepository = {
  /**
   * Records a view, moving this product to the front of the user's recently-viewed
   * list. Re-viewing a product replaces its earlier entry instead of duplicating it.
   */
  async recordView(userId: bigint, productId: bigint) {
    await db.recently_viewed_products.deleteMany({
      where: { user_id: userId, product_id: productId },
    });
    await db.recently_viewed_products.create({
      data: { user_id: userId, product_id: productId },
    });
  },

  /** Most-recently-viewed product UUIDs first, excluding the given product if any. */
  async findRecentProductUuids(
    userId: bigint,
    limit: number,
    excludeProductId?: bigint
  ): Promise<string[]> {
    const rows = await db.recently_viewed_products.findMany({
      where: {
        user_id: userId,
        is_active: true,
        ...(excludeProductId ? { product_id: { not: excludeProductId } } : {}),
        products: { isActive: true, deleted_at: null },
      },
      orderBy: { viewed_at: "desc" },
      take: limit,
      select: { products: { select: { uuid: true, id: true } } },
    });

    return rows
      .map((row) => row.products.uuid)
      .filter((uuid): uuid is string => Boolean(uuid));
  },
};
