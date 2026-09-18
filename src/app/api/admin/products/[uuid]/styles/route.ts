import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess, apiCreated } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { styleService } from "@/features/styles/services/style.service";
import {
  createAdminStyleSchema,
  adminStyleListQuerySchema,
  type CreateAdminStyleInput,
  type AdminStyleListQueryInput,
} from "@/features/styles/validations/admin-style.schema";

export const GET = createApiHandler(
  {
    GET: async (_request, context) => {
      const productUuid = context.params?.uuid;
      if (!productUuid) {
        throw ApiError.badRequest("Product UUID is required");
      }

      const query = context.query as AdminStyleListQueryInput;
      const result = await styleService.getAdminStyles(productUuid, {
        page: query?.page ?? 1,
        pageSize: query?.pageSize ?? 20,
        search: query?.search,
        isActive: query?.isActive,
      });

      return apiSuccess(result.data, "Styles fetched successfully", 200, result.meta);
    },
  },
  {
    requireAuth: true,
    requiredRole: ["ADMIN", "STAFF"],
    querySchema: adminStyleListQuerySchema,
  }
);

export const POST = createApiHandler(
  {
    POST: async (_request, context) => {
      const productUuid = context.params?.uuid;
      if (!productUuid) {
        throw ApiError.badRequest("Product UUID is required");
      }

      const body = context.body as CreateAdminStyleInput;
      const adminEmail = context.session?.user?.email ?? undefined;

      const style = await styleService.createAdminStyle(productUuid, body, adminEmail);

      return apiCreated(style, "Style created successfully");
    },
  },
  {
    method: "POST",
    requireAuth: true,
    requiredRole: ["ADMIN"],
    bodySchema: createAdminStyleSchema,
  }
);
