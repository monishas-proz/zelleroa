import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { deliveryService } from "@/features/delivery/services/delivery.service";
import {
  refreshCourierTrackingSchema,
  type RefreshCourierTrackingInput,
} from "@/features/delivery/validations/delivery.schema";

export const POST = createApiHandler(
  {
    POST: async (_request, context) => {
      const body = context.body as RefreshCourierTrackingInput;
      const adminEmail = context.session?.user?.email;
      const result = await deliveryService.refreshCourierTracking(body, adminEmail);

      return apiSuccess(result, "Tracking updated", 200);
    },
  },
  {
    requireAuth: true,
    requiredRole: ["ADMIN", "STAFF"],
    bodySchema: refreshCourierTrackingSchema,
  }
);
