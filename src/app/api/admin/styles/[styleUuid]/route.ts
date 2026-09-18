import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { styleService } from "@/features/styles/services/style.service";

export const GET = createApiHandler(
  {
    GET: async (_request, context) => {
      const styleUuid = context.params?.styleUuid;
      if (!styleUuid) {
        throw ApiError.badRequest("Style UUID is required");
      }

      const style = await styleService.getStyleByUuid(styleUuid);
      return apiSuccess(style, "Style fetched successfully");
    },
  },
  {
    requireAuth: true,
    requiredRole: ["ADMIN", "STAFF"],
  }
);
