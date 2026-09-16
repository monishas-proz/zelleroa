import { useMutation } from "@tanstack/react-query";
import { subscribeToNewsletter } from "../api/newsletter.api";
import type { SubscribeNewsletterInput } from "../validations/newsletter.schema";

export function useNewsletterSubscribe() {
  return useMutation({
    mutationFn: (data: SubscribeNewsletterInput) => subscribeToNewsletter(data),
  });
}
