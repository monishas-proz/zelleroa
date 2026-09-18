import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { variantUnitPriceService } from "@/features/variants/services/variant-unit-price.service";
import {
  bulkSetSamePriceSchema,
  type BulkSetSamePriceInput,
} from "@/features/variants/validations/admin-variant-unit-price.schema";

/** "Same price for all sizes", with optional per-size overrides. */
export const POST = createApiHandler(
  {
    POST: async (_request, context) => {
      const variantUuid = context.params?.variantUuid;
      if (!variantUuid || typeof variantUuid !== "string") {
        throw ApiError.badRequest("Invalid variant UUID");
      }

      const body = context.body as BulkSetSamePriceInput;
      const adminEmail = context.session?.user?.email ?? undefined;

      const unitPrices = await variantUnitPriceService.bulkSetSamePriceForVariant(
        variantUuid,
        body,
        adminEmail
      );

      return apiSuccess(unitPrices, "Price applied to all sizes successfully");
    },
  },
  {
    method: "POST",
    requireAuth: true,
    requiredRole: ["ADMIN"],
    bodySchema: bulkSetSamePriceSchema,
  }
);
