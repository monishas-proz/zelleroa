import { newsletterRepository } from "../repositories/newsletter.repository";
import type { SubscribeNewsletterInput } from "../validations/newsletter.schema";

export const newsletterService = {
  async subscribe(input: SubscribeNewsletterInput): Promise<{ email: string }> {
    const subscriber = await newsletterRepository.upsertByEmail(input.email);
    return { email: subscriber.email };
  },
};
