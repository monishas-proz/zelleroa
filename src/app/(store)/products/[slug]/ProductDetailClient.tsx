"use client";

import { useCustomerStyle } from "@/features/customers/hooks/use-customer-catalog";
import { StyleDetailView } from "@/features/styles/components/storefront/StyleDetailView";
import { RecentlyViewed } from "@/features/products/components/RecentlyViewed";
import { RecommendedProducts } from "@/features/products/components/RecommendedProducts";
import { ErrorState } from "@/components/ui/error-state";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/ui/breadcrumb";

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start animate-pulse">
      {/* Gallery Skeleton */}
      <div className="lg:col-span-6 space-y-4">
        <div className="aspect-square w-full rounded-2xl border border-theme-border overflow-hidden skeleton-shimmer" />
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-xl border border-theme-border overflow-hidden skeleton-shimmer shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Details Skeleton */}
      <div className="lg:col-span-6 space-y-6">
        <div className="space-y-2.5">
          <div className="h-4 w-28 rounded-md skeleton-shimmer" />
          <div className="h-8 w-3/4 rounded-xl skeleton-shimmer" />
          <div className="h-6 w-36 rounded-lg skeleton-shimmer" />
        </div>

        <div className="space-y-2 pt-2 border-t border-theme-border-subtle">
          <div className="h-4 w-full rounded-md skeleton-shimmer" />
          <div className="h-4 w-5/6 rounded-md skeleton-shimmer" />
          <div className="h-4 w-2/3 rounded-md skeleton-shimmer" />
        </div>

        <div className="space-y-3 pt-2">
          <div className="h-4 w-32 rounded-md skeleton-shimmer" />
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 w-24 rounded-xl skeleton-shimmer"
              />
            ))}
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <div className="h-12 w-28 rounded-xl skeleton-shimmer" />
          <div className="h-12 flex-1 rounded-xl skeleton-shimmer" />
          <div className="h-12 w-12 rounded-xl skeleton-shimmer shrink-0" />
        </div>
      </div>
    </div>
  );
}

/**
 * `slug` is the Style UUID the listing card links to - the Style is the unit
 * customers browse, and its Items/Colours/Sizes are chosen on this page.
 */
export function ProductDetailClient({ slug }: { slug: string }) {
  const { data: style, isLoading, error, refetch } = useCustomerStyle(slug);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="mt-6">
          <ProductDetailSkeleton />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          message="Failed to load product"
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  if (!style) {
    return (
      <PageContainer>
        <ErrorState message="Product not found" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: "Products", href: "/products" },
          ...(style.category
            ? [{ label: style.category.name, href: `/categories/${style.category.id}` }]
            : []),
          { label: style.name },
        ]}
      />
      <div className="mt-6">
        <StyleDetailView style={style} />
      </div>
      {/* Related/recently-viewed are keyed off the parent Product, not the Style. */}
      <RecommendedProducts productId={style.product.id} />
      <RecentlyViewed currentProductId={style.product.id} />
    </PageContainer>
  );
}
