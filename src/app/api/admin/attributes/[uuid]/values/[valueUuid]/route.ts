import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { attributeService } from "@/features/attributes/services/attribute.service";
import {
  updateAttributeValueSchema,
  type UpdateAttributeValueInput,
} from "@/features/attributes/validations/admin-attribute.schema";

export const PUT = createApiHandler(
  {
    PUT: async (_request, context) => {
      const uuid = context.params?.uuid;
      const valueUuid = context.params?.valueUuid;
      if (!uuid || !valueUuid) {
        throw ApiError.badRequest("Attribute UUID and value UUID are required");
      }

      const body = context.body as UpdateAttributeValueInput;
      if (body.value === undefined && body.priceAdjustment === undefined) {
        throw ApiError.badRequest("Nothing to update");
      }
      const adminEmail = context.session?.user?.email ?? undefined;

      const attribute = await attributeService.updateValue(
        uuid,
        valueUuid,
        body.value,
        adminEmail,
        body.priceAdjustment
      );
      return apiSuccess(attribute, "Attribute value updated successfully");
    },
  },
  {
    method: "PUT",
    requireAuth: true,
    requiredRole: ["ADMIN"],
    bodySchema: updateAttributeValueSchema,
  }
);

export const DELETE = createApiHandler(
  {
    DELETE: async (_request, context) => {
      const uuid = context.params?.uuid;
      const valueUuid = context.params?.valueUuid;
      if (!uuid || !valueUuid) {
        throw ApiError.badRequest("Attribute UUID and value UUID are required");
      }

      const adminEmail = context.session?.user?.email ?? undefined;
      const attribute = await attributeService.deleteValue(uuid, valueUuid, adminEmail);

      return apiSuccess(attribute, "Attribute value deleted successfully");
    },
  },
  {
    method: "DELETE",
    requireAuth: true,
    requiredRole: ["ADMIN"],
  }
);
