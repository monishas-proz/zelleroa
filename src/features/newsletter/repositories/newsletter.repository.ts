import { db } from "@/lib/db/prisma";

export const newsletterRepository = {
  /** Re-subscribing an email that previously unsubscribed reactivates the same row. */
  async upsertByEmail(email: string) {
    return db.newsletter_subscribers.upsert({
      where: { email },
      create: { email, is_active: true },
      update: { is_active: true, subscribed_at: new Date() },
    });
  },
};
