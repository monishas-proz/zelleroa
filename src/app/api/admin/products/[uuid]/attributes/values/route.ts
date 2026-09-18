import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { attributeService } from "@/features/attributes/services/attribute.service";

export const GET = createApiHandler(
  {
    GET: async (_request, context) => {
      const uuid = context.params?.uuid;
      if (!uuid) {
        throw ApiError.badRequest("Product UUID is required");
      }

      const attributes = await attributeService.getConfiguredAttributesForProduct(uuid);
      return apiSuccess(attributes, "Configured product attributes fetched successfully");
    },
  },
  {
    method: "GET",
    requireAuth: true,
    requiredRole: ["ADMIN"],
  }
);
