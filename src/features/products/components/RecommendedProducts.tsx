"use client";

import { useCustomerRelatedProducts } from "@/features/customers/hooks/use-customer-catalog";
import { CustomerProductGrid } from "@/features/customers/components/catalog/CustomerProductGrid";

interface RecommendedProductsProps {
  productId: string;
  title?: string;
  limit?: number;
}

/** Same category/brand as the given product - the storefront's "You may also like". */
export function RecommendedProducts({
  productId,
  title = "You May Also Like",
  limit = 8,
}: RecommendedProductsProps) {
  const { data: products, isLoading } = useCustomerRelatedProducts(productId, limit);

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
