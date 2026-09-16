"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Flame } from "lucide-react";
import { SnackCard } from "./cards/SnackCard";
import { ProductCardSkeleton } from "./cards/ProductCardSkeleton";
import { useCustomerVariants } from "@/features/variants";
import { useCategoryTree } from "@/features/categories/hooks";
import { useAddToCart } from "@/features/cart/hooks/use-cart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlistedUnitPriceIds,
} from "@/features/wishlist/hooks/use-wishlist";
import { mapVariantToStorefrontProduct } from "@/lib/storefront";
import { type StorefrontProduct } from "@/constants/storefront";

export function TrendingNow() {
  const router = useRouter();
  const { data: session } = useSession();
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);

  const { data: categoryTree = [] } = useCategoryTree();

  const { data: response, isLoading, isError } = useCustomerVariants({
    categoryIds: selectedCategoryId ? [selectedCategoryId] : undefined,
    page: 1,
    pageSize: 4,
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

  return (
    <section className="relative w-full bg-white">
      <div className="w-full max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14">
        {toastMessage && (
          <div className="fixed top-24 right-4 z-50 rounded-xl bg-theme-text-primary text-white px-5 py-3 shadow-xl text-sm font-medium animate-in fade-in-0 duration-200">
            {toastMessage}
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-600">
              <Flame className="h-3.5 w-3.5" />
              High Demand
            </span>
            <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-theme-text-primary">
              Trending Now
            </h2>
            <p className="mt-2 text-sm text-theme-text-subtle">
              The styles and everyday essentials everyone&apos;s talking about.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                selectedCategoryId === null
                  ? "bg-theme-primary text-white"
                  : "bg-theme-primary-light text-theme-primary hover:bg-theme-primary/20"
              }`}
            >
              All
            </button>
            {categoryTree.map((root) => (
              <button
                key={root.id}
                type="button"
                onClick={() => setSelectedCategoryId(root.id)}
                className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                  selectedCategoryId === root.id
                    ? "bg-theme-primary text-white"
                    : "bg-theme-primary-light text-theme-primary hover:bg-theme-primary/20"
                }`}
              >
                {root.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))}

          {!isLoading &&
            products.map((product) => (
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
      </div>
    </section>
  );
}

export default TrendingNow;
