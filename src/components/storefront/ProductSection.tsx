"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Clock, ArrowRight } from "lucide-react";
import { SnackCard } from "./cards/SnackCard";
import { ProductCardSkeleton } from "./cards/ProductCardSkeleton";
import { useCustomerVariants } from "@/features/variants";
import { useAddToCart } from "@/features/cart/hooks/use-cart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlistedUnitPriceIds,
} from "@/features/wishlist/hooks/use-wishlist";
import { mapVariantToStorefrontProduct } from "@/lib/storefront";
import { type StorefrontProduct } from "@/constants/storefront";

export interface ProductSectionProps {
  selectedCategoryId?: string | null;
}

export function ProductSection({ selectedCategoryId }: ProductSectionProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showAll, setShowAll] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Fetch variants from the real Customer Catalog API
  const { data: response, isLoading, isError } = useCustomerVariants({
    categoryIds: selectedCategoryId ? [selectedCategoryId] : undefined,
    page: 1,
    pageSize: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { wishlistedIds } = useWishlistedUnitPriceIds({ enabled: !!session });
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const products: StorefrontProduct[] = React.useMemo(() => {
    return (response?.data ?? []).map(mapVariantToStorefrontProduct);
  }, [response]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const requireLogin = () => {
    router.push("/login?callbackUrl=/");
  };

  const handleAddToCart = (product: StorefrontProduct, unitPriceId: string) => {
    if (!session) return requireLogin();
    addToCart.mutate(
      { variantUnitPriceId: unitPriceId, quantity: 1 },
      {
        onSuccess: () => showNotification(`Added ${product.name} to cart`),
        onError: () => showNotification("Could not add item to cart"),
      }
    );
  };

  const handleWishlistToggle = (product: StorefrontProduct, unitPriceId: string) => {
    if (!session) return requireLogin();
    if (wishlistedIds.has(unitPriceId)) {
      removeFromWishlist.mutate(unitPriceId, {
        onSuccess: () => showNotification(`Removed ${product.name} from wishlist`),
      });
    } else {
      addToWishlist.mutate(unitPriceId, {
        onSuccess: () => showNotification(`Added ${product.name} to wishlist`),
      });
    }
  };

  const visibleProducts = showAll ? products : products.slice(0, 4);
  const totalStyles = response?.meta?.total ?? products.length;

  return (
    <section className="relative w-full bg-theme-primary-light/40">
      <div className="w-full max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14">
        {/* Toast alert feedback */}
        {toastMessage && (
          <div className="fixed top-24 right-4 z-50 rounded-xl bg-theme-text-primary text-white px-5 py-3 shadow-xl text-sm font-medium animate-in fade-in-0 duration-200">
            {toastMessage}
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-theme-primary">
              <Clock className="h-3.5 w-3.5" />
              Fresh Drops
            </span>
            <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-theme-text-primary">
              Just In
            </h2>
            <p className="mt-2 text-sm text-theme-text-subtle">
              Fresh styles, new finds and products you&apos;ll want to add to your collection.
            </p>
          </div>

          {!isLoading && products.length > 0 && (
            <span className="text-xs font-semibold text-theme-text-subtle">
              Showing {visibleProducts.length} of {totalStyles} styles
            </span>
          )}
        </div>

        {/* Products Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))}

          {!isLoading &&
            visibleProducts.map((product) => (
              <SnackCard
                key={product.id}
                product={product}
                showRating
                isWishlisted={product.unitPrices.some((u) => wishlistedIds.has(u.id))}
                onWishlistToggle={(unitPriceId) =>
                  handleWishlistToggle(product, unitPriceId || product.unitPrices[0]?.id)
                }
                onAddToCart={(unitPriceId) =>
                  handleAddToCart(product, unitPriceId || product.unitPrices[0]?.id)
                }
                disabled={addToCart.isPending}
              />
            ))}
        </div>

        {/* Empty State */}
        {!isLoading && !isError && products.length === 0 && (
          <div className="py-16 text-center text-sm text-theme-text-subtle">
            <p className="text-base font-medium text-theme-text-primary">
              No items found in this collection.
            </p>
            <p className="mt-1 text-xs text-theme-text-subtle">
              Please explore our other fashion categories and arrivals.
            </p>
          </div>
        )}

        {/* View All Button */}
        {products.length > 4 && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center justify-center gap-2 px-7 py-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold uppercase tracking-wide transition-colors cursor-pointer"
            >
              {showAll ? "Show Less" : "View All New Arrivals"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductSection;
