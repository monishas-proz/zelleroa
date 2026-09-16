import { z } from "zod";

export const subscribeNewsletterSchema = z
  .object({
    email: z
      .string({ message: "Email is required" })
      .trim()
      .email("Invalid email address")
      .max(150, "Email cannot exceed 150 characters"),
  })
  .strict();

export type SubscribeNewsletterInput = z.infer<typeof subscribeNewsletterSchema>;
