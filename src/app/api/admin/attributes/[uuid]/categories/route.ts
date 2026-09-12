import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { attributeService } from "@/features/attributes/services/attribute.service";
import {
  setAttributeCategoriesSchema,
  type SetAttributeCategoriesInput,
} from "@/features/attributes/validations/admin-attribute.schema";

export const PUT = createApiHandler(
  {
    PUT: async (_request, context) => {
      const uuid = context.params?.uuid;
      if (!uuid) {
        throw ApiError.badRequest("Attribute UUID is required");
      }

      const body = context.body as SetAttributeCategoriesInput;
      const attribute = await attributeService.setCategories(uuid, body);

      return apiSuccess(attribute, "Attribute categories updated successfully");
    },
  },
  {
    method: "PUT",
    requireAuth: true,
    requiredRole: ["ADMIN"],
    bodySchema: setAttributeCategoriesSchema,
  }
);
