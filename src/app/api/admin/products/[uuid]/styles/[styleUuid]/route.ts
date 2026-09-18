import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { styleService } from "@/features/styles/services/style.service";
import {
  updateAdminStyleSchema,
  type UpdateAdminStyleInput,
} from "@/features/styles/validations/admin-style.schema";

export const GET = createApiHandler(
  {
    GET: async (_request, context) => {
      const productUuid = context.params?.uuid;
      const styleUuid = context.params?.styleUuid;
      if (!productUuid || !styleUuid) {
        throw ApiError.badRequest("Product UUID and Style UUID are required");
      }

      const style = await styleService.getAdminStyleByUuid(productUuid, styleUuid);
      return apiSuccess(style, "Style fetched successfully");
    },
  },
  {
    requireAuth: true,
    requiredRole: ["ADMIN", "STAFF"],
  }
);

export const PUT = createApiHandler(
  {
    PUT: async (_request, context) => {
      const productUuid = context.params?.uuid;
      const styleUuid = context.params?.styleUuid;
      if (!productUuid || !styleUuid) {
        throw ApiError.badRequest("Product UUID and Style UUID are required");
      }

      const body = context.body as UpdateAdminStyleInput;
      const adminEmail = context.session?.user?.email ?? undefined;

      const style = await styleService.updateAdminStyle(productUuid, styleUuid, body, adminEmail);

      return apiSuccess(style, "Style updated successfully");
    },
  },
  {
    method: "PUT",
    requireAuth: true,
    requiredRole: ["ADMIN"],
    bodySchema: updateAdminStyleSchema,
  }
);

export const DELETE = createApiHandler(
  {
    DELETE: async (_request, context) => {
      const productUuid = context.params?.uuid;
      const styleUuid = context.params?.styleUuid;
      if (!productUuid || !styleUuid) {
        throw ApiError.badRequest("Product UUID and Style UUID are required");
      }

      const adminEmail = context.session?.user?.email ?? undefined;
      const result = await styleService.deleteAdminStyle(productUuid, styleUuid, adminEmail);

      return apiSuccess(null, result.message);
    },
  },
  {
    method: "DELETE",
    requireAuth: true,
    requiredRole: ["ADMIN"],
  }
);
