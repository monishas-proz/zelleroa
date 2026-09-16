import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { newsletterService } from "@/features/newsletter/services/newsletter.service";
import {
  subscribeNewsletterSchema,
  type SubscribeNewsletterInput,
} from "@/features/newsletter/validations/newsletter.schema";

export const POST = createApiHandler(
  {
    POST: async (_request, context) => {
      const body = context.body as SubscribeNewsletterInput;
      const result = await newsletterService.subscribe(body);

      return apiSuccess(result, "Subscribed successfully", 201);
    },
  },
  {
    requireAuth: false,
    bodySchema: subscribeNewsletterSchema,
  }
);
