import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { catalogService } from "@/features/customers/services/catalog.service";
import { uuidParamSchema } from "@/features/customers/validations/catalog.schema";

/**
 * The storefront Style detail page: the Style plus every Item under it, with
 * each Item's Colors and each Color's Sizes, prices and stock.
 */
export const GET = createApiHandler({
  GET: async (_request, context) => {
    const styleUuid = context.params?.styleUuid || context.params?.uuid;
    if (!styleUuid) {
      throw ApiError.badRequest("Style UUID is required");
    }

    const validUuid = uuidParamSchema.parse(styleUuid);
    const style = await catalogService.getStyleByUuid(validUuid);

    return apiSuccess(style, "Style fetched successfully", 200);
  },
});
