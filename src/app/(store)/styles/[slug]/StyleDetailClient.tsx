"use client";

import { redirect } from "next/navigation";
import { useCustomerStyle } from "@/features/customers/hooks/use-customer-catalog";
import { ItemViewSkeleton } from "@/features/items/components/storefront/ItemViewSkeleton";
import { ErrorState } from "@/components/ui/error-state";
import { PageContainer } from "@/components/layout/PageContainer";
import { styleDefaultItemId, itemHref } from "@/features/customers/utils/style-default-item";

/**
 * Fallback for a Style link the server could not resolve to an Item.
 *
 * There is deliberately no Item picker here: every Item has its own page, so
 * once the Style loads the shopper is sent to its default Item. Anything else
 * is an error or empty state.
 */
export function StyleDetailClient({
  slug,
  notFoundMessage = "Style not found",
}: {
  slug: string;
  notFoundMessage?: string;
}) {
  const { data: style, isLoading, error, refetch } = useCustomerStyle(slug);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="mt-6">
          <ItemViewSkeleton />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState message="Failed to load this product" onRetry={() => refetch()} />
      </PageContainer>
    );
  }

  if (!style) {
    return (
      <PageContainer>
        <ErrorState message={notFoundMessage} />
      </PageContainer>
    );
  }

  const itemId = styleDefaultItemId(style);
  if (itemId) redirect(itemHref(itemId));

  return (
    <PageContainer>
      <ErrorState message="Nothing is available in this product right now" />
    </PageContainer>
  );
}
