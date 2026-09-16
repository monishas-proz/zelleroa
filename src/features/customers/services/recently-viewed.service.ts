import { ApiError } from "@/lib/api/api-error";
import { userRepository } from "@/features/users/repositories/user.repository";
import { catalogRepository } from "../repositories/catalog.repository";
import { catalogOffers } from "./catalog-offers";
import { recentlyViewedRepository } from "../repositories/recently-viewed.repository";
import { db } from "@/lib/db/prisma";
import type { CustomerProductListItemDto } from "../types/catalog.types";

const DEFAULT_LIMIT = 8;

async function resolveInternalUser(sessionUserId: string) {
  const user = await userRepository.findById(sessionUserId);
  if (!user || !user.internalId) {
    throw ApiError.unauthorized("User not found or unauthorized");
  }
  return user;
}

export const recentlyViewedService = {
  async recordView(sessionUserId: string, productUuid: string) {
    const user = await resolveInternalUser(sessionUserId);

    const product = await db.product.findFirst({
      where: { uuid: productUuid, isActive: true, deleted_at: null },
      select: { id: true },
    });
    if (!product) {
      throw ApiError.notFound("Product not found");
    }

    await recentlyViewedRepository.recordView(BigInt(user.internalId), product.id);
    return { success: true };
  },

  async getRecentlyViewed(
    sessionUserId: string,
    excludeProductUuid?: string,
    limit: number = DEFAULT_LIMIT
  ): Promise<CustomerProductListItemDto[]> {
    const user = await resolveInternalUser(sessionUserId);

    let excludeProductId: bigint | undefined;
    if (excludeProductUuid) {
      const excluded = await db.product.findFirst({
        where: { uuid: excludeProductUuid },
        select: { id: true },
      });
      excludeProductId = excluded?.id;
    }

    const productUuids = await recentlyViewedRepository.findRecentProductUuids(
      BigInt(user.internalId),
      limit,
      excludeProductId
    );
    if (productUuids.length === 0) return [];

    const result = await catalogRepository.findCustomerProducts({
      productIds: productUuids,
      page: 1,
      pageSize: productUuids.length,
    });
    await catalogOffers.decorateProducts(result.data);

    // findCustomerProducts doesn't preserve input order - re-sort to most-recent-first.
    const orderIndex = new Map(productUuids.map((uuid, i) => [uuid, i]));
    return [...result.data].sort(
      (a, b) => (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0)
    );
  },
};
