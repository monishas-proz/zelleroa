import { createApiHandler } from "@/lib/api/api-handler";
import { apiCreated } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { attributeService } from "@/features/attributes/services/attribute.service";
import {
  createAttributeValueSchema,
  type CreateAttributeValueInput,
} from "@/features/attributes/validations/admin-attribute.schema";

export const POST = createApiHandler(
  {
    POST: async (_request, context) => {
      const uuid = context.params?.uuid;
      if (!uuid) {
        throw ApiError.badRequest("Attribute UUID is required");
      }

      const body = context.body as CreateAttributeValueInput;
      const adminEmail = context.session?.user?.email ?? undefined;

      const attribute = await attributeService.addValue(
        uuid,
        body.value,
        adminEmail,
        body.priceAdjustment,
        body.colorHex,
        body.imageUrl
      );
      return apiCreated(attribute, "Attribute value added successfully");
    },
  },
  {
    method: "POST",
    requireAuth: true,
    requiredRole: ["ADMIN"],
    bodySchema: createAttributeValueSchema,
  }
);
