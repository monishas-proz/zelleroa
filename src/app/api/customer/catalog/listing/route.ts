import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { catalogListingService } from "@/features/customers/services/catalog-listing.service";
import { parseListingQuery } from "@/features/customers/utils/catalog-listing-query";

function parsePositiveInt(raw: string | null | undefined, fallback: number): number {
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

/**
 * Category listing: one page of Style cards plus the filters that apply to
 * the category. Takes the storefront page's own query string, e.g.
 * `?category=dresses&colour=Black&size=M,L&minPrice=500&sort=price_asc&page=2`
 * - any key other than the reserved ones is an attribute slug. See
 * `features/customers/utils/catalog-listing-query.ts`.
 */
export const GET = createApiHandler(
  {
    GET: async (_request, context) => {
      const searchParams = context.searchParams ?? new URLSearchParams();
      const result = await catalogListingService.getListing({
        categoryKey: searchParams.get("category")?.trim().slice(0, 170) || null,
        query: parseListingQuery(searchParams),
        page: parsePositiveInt(searchParams.get("page"), 1),
        pageSize: parsePositiveInt(searchParams.get("pageSize"), 24),
      });
      return apiSuccess(result.data, "Listing fetched successfully", 200, result.meta);
    },
  },
  {
    // Every filter click is a request; the default 60/min is tight for that.
    rateLimit: { limit: 240, windowMs: 60_000 },
  }
);
