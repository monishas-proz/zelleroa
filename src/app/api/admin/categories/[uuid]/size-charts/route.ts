import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { sizeChartService } from "@/features/size-charts/services/size-chart.service";
import {
  setSizeChartSchema,
  type SetSizeChartInput,
} from "@/features/size-charts/validations/size-chart.schema";

export const PUT = createApiHandler(
  {
    PUT: async (_request, context) => {
      const uuid = context.params?.uuid;
      if (!uuid) {
        throw ApiError.badRequest("Category UUID is required");
      }

      const body = context.body as SetSizeChartInput;
      const sizes = await sizeChartService.setSizeChart(uuid, body.gender, body.attributeValueIds);
      return apiSuccess(sizes, "Size chart updated successfully");
    },
  },
  {
    method: "PUT",
    requireAuth: true,
    requiredRole: ["ADMIN"],
    bodySchema: setSizeChartSchema,
  }
);
