"use client";

import { useState } from "react";
import Link from "next/link";
import { useCustomerStyle } from "@/features/customers/hooks/use-customer-catalog";
import { StyleItemCard } from "@/features/styles/components/storefront/StyleItemCard";
import { ItemView } from "@/features/items/components/storefront";
import { ItemViewSkeleton } from "@/features/items/components/storefront/ItemViewSkeleton";
import { ErrorState } from "@/components/ui/error-state";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/ui/breadcrumb";

/**
 * The Style detail page: pick an Item, then buy a Colour+Size of it.
 *
 * The Item picker only appears when the Style actually has more than one Item;
 * with a single Item the page is just that Item's view, since there would be
 * nothing to choose between.
 */
export function StyleDetailClient({ slug }: { slug: string }) {
  const { data: style, isLoading, error, refetch } = useCustomerStyle(slug);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

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
        <ErrorState message="Failed to load this style" onRetry={() => refetch()} />
      </PageContainer>
    );
  }

  if (!style) {
    return (
      <PageContainer>
        <ErrorState message="Style not found" />
      </PageContainer>
    );
  }

  // The shopper's pick wins while it names an Item of this Style; before they
  // pick one - and if the page is pointed at a different Style - it falls back
  // to the default Item, so no effect is needed to keep the two in step.
  const items = style.items ?? [];
  const selectedItem =
    items.find((item) => item.id === selectedItemId) ??
    items.find((item) => item.isDefault) ??
    items[0] ??
    null;

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

      {items.length > 1 && (
        <section className="mt-6 space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-bold text-theme-text-primary">
              Choose from {style.name}
            </h2>
            <span className="text-sm text-theme-text-subtle">
              {items.length} options
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((item) => (
              <StyleItemCard
                key={item.id}
                item={item}
                isSelected={item.id === selectedItem?.id}
                onSelect={setSelectedItemId}
              />
            ))}
          </div>
        </section>
      )}

      <div className="mt-8">
        {selectedItem ? (
          <ItemView
            key={selectedItem.id}
            item={selectedItem}
            eyebrow={style.name}
            returnUrl={`/styles/${style.id}`}
          />
        ) : (
          <ErrorState message="Nothing is available in this style right now" />
        )}
      </div>

      {selectedItem && (
        <p className="mt-8 text-sm text-theme-text-subtle">
          <Link
            href={`/items/${selectedItem.id}`}
            className="font-semibold text-theme-primary hover:underline"
          >
            Open {selectedItem.name} on its own page
          </Link>
        </p>
      )}
    </PageContainer>
  );
}
