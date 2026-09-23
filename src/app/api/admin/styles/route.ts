import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { styleRepository } from "@/features/styles/repositories/style.repository";
import { adminStyleListQuerySchema, type AdminStyleListQueryInput } from "@/features/styles/validations/admin-style.schema";
import type { AdminStyleResponse } from "@/features/styles/types";

function formatStyleListRow(style: Awaited<ReturnType<typeof styleRepository.findAdminList>>["data"][number]): AdminStyleResponse {
  const primaryImgObj = style.images?.find((img) => img.is_primary) ?? style.images?.[0];
  return {
    id: style.uuid,
    productId: style.product?.uuid ?? String(style.productId),
    productName: style.product?.name ?? "",
    productSlug: style.product?.slug ?? "",
    categoryId: style.product?.categoryId ? String(style.product.categoryId) : null,
    categoryName: null,
    brandId: style.brand?.uuid ?? null,
    brandName: style.brand?.name ?? null,
    name: style.name,
    slug: style.slug,
    sku: style.sku,
    shortDescription: style.short_description,
    description: style.description,
    ingredients: style.ingredients,
    isReadyToMix: Boolean(style.is_ready_to_mix),
    cookingRecipe: style.cooking_recipe,
    shelfLife: style.shelf_life,
    vegType: (style.veg_type as AdminStyleResponse["vegType"]) || "na",
    basePrice: Number(style.base_price ?? 0),
    isFeatured: Boolean(style.is_featured),
    isDefault: Boolean(style.is_default),
    isActive: Boolean(style.isActive),
    outOfStock: Boolean(style.out_of_stock),
    primaryImage: primaryImgObj ? primaryImgObj.image_url : null,
    itemCount: style._count?.items ?? 0,
    createdAt: style.createdAt,
    updatedAt: style.updatedAt,
  };
}

export const GET = createApiHandler(
  {
    GET: async (_request, context) => {
      const query = context.query as AdminStyleListQueryInput & {
        productId?: string;
        categoryId?: string;
      };

      const result = await styleRepository.findAdminList({
        page: query?.page ?? 1,
        pageSize: query?.pageSize ?? 20,
        search: query?.search,
        isActive: query?.isActive,
        productId: query?.productId,
        categoryId: query?.categoryId,
      });

      return apiSuccess(
        result.data.map(formatStyleListRow),
        "Styles fetched successfully",
        200,
        result.meta
      );
    },
  },
  {
    requireAuth: true,
    requiredRole: ["ADMIN", "STAFF"],
    querySchema: adminStyleListQuerySchema,
  }
);
