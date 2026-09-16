"use client";

import { useEffect, useRef } from "react";
import {
  useRecentlyViewedProducts,
  useRecordProductView,
} from "@/features/customers/hooks/use-customer-catalog";
import { CustomerProductGrid } from "@/features/customers/components/catalog/CustomerProductGrid";

interface RecentlyViewedProps {
  /** Pass the product currently being viewed to record it and exclude it from the list. */
  currentProductId?: string;
  title?: string;
}

export function RecentlyViewed({
  currentProductId,
  title = "Recently Viewed",
}: RecentlyViewedProps) {
  const { data: products, isLoading } = useRecentlyViewedProducts(currentProductId);
  const { mutate: recordView, isAuthenticated } = useRecordProductView();

  const recordedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!currentProductId || !isAuthenticated) return;
    if (recordedFor.current === currentProductId) return;
    recordedFor.current = currentProductId;
    recordView(currentProductId);
  }, [currentProductId, isAuthenticated, recordView]);

  if (isLoading || !products || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl sm:text-2xl font-bold text-theme-text-primary mb-6">{title}</h2>
      <CustomerProductGrid products={products} columns={4} />
    </section>
  );
}
