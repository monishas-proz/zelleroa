"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, Loader2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/Toast";
import { ProductGallery } from "@/features/products/components/ProductGallery";
import { ReviewRatingStars } from "@/features/reviews/components/ReviewRatingStars";
import { ProductReviewsSection } from "@/features/reviews/components/ProductReviewsSection";
import { usePublicVariantReviews } from "@/features/reviews/hooks/use-public-reviews";
import { useAddToCart } from "@/features/cart/hooks/use-cart";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/features/wishlist/hooks/use-wishlist";
import { cn, getImageUrl } from "@/lib/utils";
import { sanitizeRichText } from "@/lib/sanitize-html";
import type { CustomerStyleItemDto } from "@/features/customers/types/catalog.types";
import { useItemSelection } from "../../hooks/use-item-selection";
import { ItemColorSelector } from "./ItemColorSelector";
import { ItemSizeSelector } from "./ItemSizeSelector";
import { ItemAttributeFacts } from "./ItemAttributeFacts";
import { ItemPriceBlock } from "./ItemPriceBlock";

interface ItemViewProps {
  item: CustomerStyleItemDto;
  /** Where to send an anonymous shopper back to after signing in. */
  returnUrl: string;
  /** Rendered above the title, e.g. the Style or Product name. */
  eyebrow?: string | null;
  className?: string;
}

/**
 * One Item, as the shopper sees it.
 *
 * The whole view is driven by the selected Colour:
 *
 *   Colour -> images -> available Sizes -> stock -> price
 *
 * so switching Colour swaps the gallery, the Size chips, the stock state and
 * the price together. What goes in the cart is never the Item itself but the
 * exact Colour+Size row selected here.
 *
 * Used both on the standalone Item page and inside the Style page, where the
 * shopper picks an Item first.
 */
export function ItemView({ item, returnUrl, eyebrow, className }: ItemViewProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    colors,
    selectedColor,
    selectColor,
    sizes,
    selectedSize,
    selectSize,
    hasColors,
    hasSizes,
    purchasable,
    images,
    inStock,
    quantity,
    setQuantity,
    missingSelection,
  } = useItemSelection(item);

  const addToCart = useAddToCart();
  const { data: wishlist } = useWishlist({ enabled: !!session });
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  // Reviews are held at the Colour (variant) level, so they follow the Colour
  // the shopper is looking at rather than the Item as a whole.
  const { data: reviewsData } = usePublicVariantReviews(selectedColor?.id);
  const averageRating = reviewsData?.ratingSummary?.averageRating ?? 0;
  const reviewCount =
    reviewsData?.ratingSummary?.totalReviews ?? reviewsData?.reviews?.length ?? 0;

  const galleryImages = images.map((image) => ({
    id: image.id,
    url: getImageUrl(image.imageUrl),
    altText: selectedColor?.colorName
      ? `${item.name} - ${selectedColor.colorName}`
      : item.name,
  }));

  const isInWishlist =
    !!selectedSize &&
    !!wishlist?.items.some((entry) => entry.variantUnitPriceId === selectedSize.id);

  const requireSignIn = () => {
    if (session) return false;
    router.push(`/login?callbackUrl=${encodeURIComponent(returnUrl)}`);
    return true;
  };

  const handleAddToCart = () => {
    if (requireSignIn()) return;

    // The cart line is a Colour+Size combination, so neither can be left
    // unresolved - validate before adding rather than adding the wrong row.
    if (missingSelection === "color") {
      toast.error("Please select a colour");
      return;
    }
    if (missingSelection === "size") {
      toast.error("Please select a size");
      return;
    }
    if (!purchasable) {
      toast.error(hasSizes ? "This size is out of stock" : "This item is out of stock");
      return;
    }

    addToCart.mutate(
      {
        variantUnitPriceId: purchasable.id,
        variantId: selectedColor?.id,
        quantity,
      },
      {
        onSuccess: () => toast.success(`${item.name} added to cart`),
        onError: () => toast.error("Could not add this item to your cart"),
      }
    );
  };

  const handleWishlistToggle = () => {
    if (requireSignIn()) return;
    if (!selectedSize) {
      toast.error(hasSizes ? "Please select a size" : "Nothing to save yet");
      return;
    }
    if (addToWishlist.isPending || removeFromWishlist.isPending) return;

    if (isInWishlist) {
      removeFromWishlist.mutate(selectedSize.id);
    } else {
      addToWishlist.mutate(selectedSize.id);
    }
  };

  const description = item.description?.trim();
  const wishlistPending = addToWishlist.isPending || removeFromWishlist.isPending;
  const maxQuantity = purchasable?.stock ?? 0;

  return (
    <div className={cn("space-y-12", className)}>
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        {/* 1. Gallery - keyed on the Colour so it resets to the first image of
            whichever Colour is selected. */}
        <div className="lg:col-span-6">
          <ProductGallery
            key={selectedColor?.id ?? item.id}
            images={galleryImages}
            productName={item.name}
            isInStock={inStock}
            isVeg={false}
            showQualitySeal={false}
          />
        </div>

        <div className="space-y-6 lg:col-span-6">
          {/* 2. Name, with the 10. rating summary beside it */}
          <div className="space-y-2">
            {eyebrow && (
              <p className="text-xs font-bold uppercase tracking-wide text-theme-text-subtle">
                {eyebrow}
              </p>
            )}
            <h1 className="text-2xl font-bold leading-tight text-theme-text-primary sm:text-3xl">
              {item.name}
            </h1>

            {reviewCount > 0 && (
              <a
                href="#item-reviews"
                className="inline-flex items-center gap-2 text-sm text-theme-text-subtle hover:text-theme-text-primary"
              >
                <ReviewRatingStars rating={averageRating} size="sm" showScore />
                <span>
                  {reviewCount} review{reviewCount === 1 ? "" : "s"}
                </span>
              </a>
            )}

            {/* 3. Short description */}
            {item.shortDescription && (
              <p className="pt-1 text-sm leading-relaxed text-theme-text-subtle">
                {item.shortDescription}
              </p>
            )}
          </div>

          {/* 7. Amount - this exact Colour+Size, with any offer applied */}
          <ItemPriceBlock
            size={selectedSize}
            minPrice={item.minPrice}
            maxPrice={item.maxPrice}
            className="border-y border-theme-border-subtle py-4"
          />

          {/* 4. Colour */}
          {hasColors && (
            <ItemColorSelector
              colors={colors}
              selectedColorId={selectedColor?.id ?? null}
              onSelect={selectColor}
            />
          )}

          {/* 5. Size - only when the selected Colour actually carries sizes */}
          {hasSizes && (
            <ItemSizeSelector
              sizes={sizes}
              selectedSizeId={selectedSize?.id ?? null}
              onSelect={selectSize}
            />
          )}

          {/* 6. Extra attributes */}
          <ItemAttributeFacts item={item} selectedColor={selectedColor} />

          {/* 9. Quantity and add to cart */}
          <div className="space-y-3 pt-2">
            {purchasable && purchasable.stock <= 5 && (
              <p className="text-sm font-semibold text-amber-700">
                Only {purchasable.stock} left in stock
              </p>
            )}

            <div className="flex items-center gap-3">
              <div className="flex h-12 items-center rounded-xl border border-theme-border">
                <button
                  type="button"
                  onClick={() => setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-full w-10 cursor-pointer items-center justify-center text-theme-text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!purchasable || quantity >= maxQuantity}
                  aria-label="Increase quantity"
                  className="flex h-full w-10 cursor-pointer items-center justify-center text-theme-text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                type="button"
                onClick={handleAddToCart}
                disabled={addToCart.isPending || !inStock}
                className="h-12 flex-1 rounded-xl text-base font-semibold"
              >
                {addToCart.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding to cart...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    {inStock ? "Add to cart" : "Out of stock"}
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleWishlistToggle}
                disabled={wishlistPending}
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className="h-12 w-12 shrink-0 rounded-xl"
              >
                {wishlistPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart
                    className={cn("h-5 w-5", isInWishlist && "fill-rose-500 text-rose-500")}
                  />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Detailed description */}
      {description && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-theme-text-primary">Description</h2>
          <div
            className="prose prose-sm max-w-none text-theme-text-secondary"
            dangerouslySetInnerHTML={{ __html: sanitizeRichText(description) }}
          />
        </section>
      )}

      {/* 10. Reviews and ratings, for the Colour on screen */}
      <section id="item-reviews" className="scroll-mt-24">
        <ProductReviewsSection
          variantId={selectedColor?.id}
          variantName={selectedColor?.colorName ?? selectedColor?.variantName}
          productName={item.name}
          selectedUnitPriceId={selectedSize?.id ?? null}
          packSizes={sizes}
        />
      </section>
    </div>
  );
}

export default ItemView;
