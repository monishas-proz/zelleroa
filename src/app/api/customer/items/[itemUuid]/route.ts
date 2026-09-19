import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { catalogService } from "@/features/customers/services/catalog.service";
import { uuidParamSchema } from "@/features/customers/validations/catalog.schema";

/**
 * The storefront Item detail page: one Item with its Colors, and each Color's
 * own images, Sizes, prices and stock.
 */
export const GET = createApiHandler({
  GET: async (_request, context) => {
    const itemUuid = context.params?.itemUuid || context.params?.uuid;
    if (!itemUuid) {
      throw ApiError.badRequest("Item UUID is required");
    }

    const validUuid = uuidParamSchema.parse(itemUuid);
    const item = await catalogService.getItemByUuid(validUuid);

    return apiSuccess(item, "Item fetched successfully", 200);
  },
});
