import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { sizeChartService } from "@/features/size-charts/services/size-chart.service";
import {
  sizeChartQuerySchema,
  type SizeChartQueryInput,
} from "@/features/size-charts/validations/size-chart.schema";

/**
 * GET /api/size-charts?category_id=&gender=
 * Public - the storefront and admin product form both need this to decide
 * whether/what Size selector to render. Empty array (not an error) when the
 * category has no size chart for that gender.
 */
export const GET = createApiHandler(
  {
    GET: async (_request, context) => {
      const query = context.query as SizeChartQueryInput;
      const sizes = await sizeChartService.getSizeChart(query.category_id, query.gender);
      return apiSuccess(sizes, "Size chart fetched successfully");
    },
  },
  {
    querySchema: sizeChartQuerySchema,
    rateLimit: { limit: 120, windowMs: 60_000 },
  }
);
