import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { attributeService } from "@/features/attributes/services/attribute.service";
import {
  updateAdminAttributeSchema,
  type UpdateAdminAttributeInput,
} from "@/features/attributes/validations/admin-attribute.schema";

export const GET = createApiHandler(
  {
    GET: async (_request, context) => {
      const uuid = context.params?.uuid;
      if (!uuid) {
        throw ApiError.badRequest("Attribute UUID is required");
      }

      const attribute = await attributeService.getAdminAttributeByUuid(uuid);
      return apiSuccess(attribute, "Attribute fetched successfully");
    },
  },
  {
    requireAuth: true,
    requiredRole: ["ADMIN"],
  }
);

export const PUT = createApiHandler(
  {
    PUT: async (_request, context) => {
      const uuid = context.params?.uuid;
      if (!uuid) {
        throw ApiError.badRequest("Attribute UUID is required");
      }

      const body = context.body as UpdateAdminAttributeInput;
      const adminEmail = context.session?.user?.email ?? undefined;

      const attribute = await attributeService.updateAdminAttribute(uuid, body, adminEmail);
      return apiSuccess(attribute, "Attribute updated successfully");
    },
  },
  {
    method: "PUT",
    requireAuth: true,
    requiredRole: ["ADMIN"],
    bodySchema: updateAdminAttributeSchema,
  }
);

export const DELETE = createApiHandler(
  {
    DELETE: async (_request, context) => {
      const uuid = context.params?.uuid;
      if (!uuid) {
        throw ApiError.badRequest("Attribute UUID is required");
      }

      const adminEmail = context.session?.user?.email ?? undefined;
      const result = await attributeService.deleteAdminAttribute(uuid, adminEmail);

      return apiSuccess(null, result.message);
    },
  },
  {
    method: "DELETE",
    requireAuth: true,
    requiredRole: ["ADMIN"],
  }
);
