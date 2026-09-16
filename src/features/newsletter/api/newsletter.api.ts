import { apiClient } from "@/lib/api/api-client";
import type { SubscribeNewsletterInput } from "../validations/newsletter.schema";

/**
 * Subscribe an email to the newsletter
 * Postman: POST /api/newsletter/subscribe
 */
export async function subscribeToNewsletter(
  data: SubscribeNewsletterInput
): Promise<{ email: string }> {
  const response = await apiClient.post<{ email: string }>(
    "/api/newsletter/subscribe",
    data
  );
  return response.data!;
}
