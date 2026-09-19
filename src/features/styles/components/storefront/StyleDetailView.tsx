"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getImageUrl } from "@/lib/utils";
import { ProductGallery, type GalleryImage } from "@/features/products/components/ProductGallery";
import { ProductReviewsSection } from "@/features/reviews/components/ProductReviewsSection";
import { useAddToCart } from "@/features/cart/hooks/use-cart";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/features/wishlist/hooks/use-wishlist";
import { sanitizeRichText } from "@/lib/sanitize-html";
import { toast } from "@/components/ui/Toast";
import type {
  CustomerStyleDetailDto,
  CustomerVariantListItemDto,
  CustomerVariantUnitPriceDto,
} from "@/features/customers/types/catalog.types";
import { StyleItemCard } from "./StyleItemCard";
import { ItemPurchasePanel } from "./ItemPurchasePanel";

interface StyleDetailViewProps {
  style: CustomerStyleDetailDto;
}

/**
 * The storefront Style detail page.
 *
 * Style -> Item -> Colour -> Size, exactly as the catalogue stores it: the
 * Style's Items are listed as cards, selecting one reveals its Colours, and
 * selecting a Colour reveals only that Colour's images, sizes, prices and
 * stock. Nothing is added to the cart until a concrete Colour+Size
 * combination (one VariantUnitPrice row) is chosen.
 */
export function StyleDetailView({ style }: StyleDetailViewProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const items = style.items;
  const hasMultipleItems = items.length > 1;

  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    () => items.find((i) => i.isDefault)?.id ?? items[0]?.id ?? null
  );
  const selectedItem = useMemo(
    () => items.find((i) => i.id === selectedItemId) ?? items[0] ?? null,
    [items, selectedItemId]
  );

  const colors = useMemo(
    () => selectedItem?.colors.filter((c) => c.colorName) ?? [],
    [selectedItem]
  );

  // With a single colour there is nothing to choose, so it is selected up
  // front. With several, the shopper picks one and the gallery stays on the
  // Item's default images until they do.
  const [selectedColorId, setSelectedColorId] = useState<string | null>(
    () => (colors.length === 1 ? colors[0].id : null)
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const selectedColor = useMemo<CustomerVariantListItemDto | null>(() => {
    if (!selectedItem) return null;
    // An Item with no colour split still has one nameless variant carrying
    // the sizes/prices - use it so those Items stay buyable.
    if (colors.length === 0) return selectedItem.colors[0] ?? null;
    return colors.find((c) => c.id === selectedColorId) ?? null;
  }, [selectedItem, colors, selectedColorId]);

  const sizes = useMemo(() => selectedColor?.unitPrices ?? [], [selectedColor]);

  const selectedSize = useMemo<CustomerVariantUnitPriceDto | null>(() => {
    if (sizes.length === 0) return null;
    const match = sizes.find((s) => s.id === selectedSizeId);
    if (match) return match;
    // A colour with exactly one sellable row (no size split) needs no choice.
    const hasNamedSizes = sizes.some((s) => s.sizeId !== null);
    if (!hasNamedSizes && sizes.length === 1) return sizes[0];
    return null;
  }, [sizes, selectedSizeId]);

  // Switching Item resets the Colour/Size choices - a different Item has its
  // own colours and sizes, so nothing carries over.
  const handleSelectItem = useCallback(
    (itemId: string) => {
      if (itemId === selectedItemId) return;
      const next = items.find((i) => i.id === itemId) ?? null;
      const nextColors = next?.colors.filter((c) => c.colorName) ?? [];
      setSelectedItemId(itemId);
      setSelectedColorId(nextColors.length === 1 ? nextColors[0].id : null);
      setSelectedSizeId(null);
      setQuantity(1);
      setValidationMessage(null);
    },
    [items, selectedItemId]
  );

  const handleSelectColor = useCallback(
    (colorId: string) => {
      setSelectedColorId(colorId);
      setValidationMessage(null);
      setQuantity(1);
      // Sizes are per-colour, so the previous pick is dropped rather than
      // carried onto a colour that may not stock it.
      const next = colors.find((c) => c.id === colorId);
      const nextSizes = next?.unitPrices ?? [];
      const hasNamedSizes = nextSizes.some((s) => s.sizeId !== null);
      setSelectedSizeId(
        !hasNamedSizes && nextSizes.length === 1 ? nextSizes[0].id : null
      );
    },
    [colors]
  );

  const handleSelectSize = useCallback((unitPriceId: string) => {
    setSelectedSizeId(unitPriceId);
    setValidationMessage(null);
    setQuantity(1);
  }, []);

  const addToCart = useAddToCart();
  const { data: wishlist } = useWishlist({ enabled: !!session });
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isWishlisted =
    !!selectedSize && !!wishlist?.items.some((i) => i.variantUnitPriceId === selectedSize.id);

  const requireLogin = () => {
    router.push(`/login?callbackUrl=/products/${style.id}`);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    // 1. Colour, when this Item offers a choice of them.
    if (colors.length > 1 && !selectedColor) {
      setValidationMessage("Please select a colour.");
      return;
    }
    if (!selectedColor) {
      setValidationMessage("This item is not available right now.");
      return;
    }

    // 2. Size, when the selected colour carries sizes.
    const hasNamedSizes = sizes.some((s) => s.sizeId !== null);
    if (!selectedSize) {
      setValidationMessage(
        hasNamedSizes || sizes.length > 1
          ? hasNamedSizes
            ? "Please select a size."
            : "Please select a pack size."
          : "This colour has nothing in stock right now."
      );
      return;
    }

    // 3. The exact combination has to be in stock.
    if (!selectedSize.inStock) {
      setValidationMessage("This combination is out of stock.");
      return;
    }
    if (quantity > selectedSize.stock) {
      setValidationMessage(`Only ${selectedSize.stock} left for this combination.`);
      return;
    }

    setValidationMessage(null);

    if (!session) {
      requireLogin();
      return;
    }

    addToCart.mutate(
      {
        variantUnitPriceId: selectedSize.id,
        variantId: selectedColor.id,
        quantity,
      },
      {
        onSuccess: () => {
          const parts = [selectedItem.name];
          if (selectedColor.colorName) parts.push(selectedColor.colorName);
          if (selectedSize.sizeLabel) parts.push(selectedSize.sizeLabel);
          toast.success(`Added ${parts.join(" / ")} to cart`);
        },
        onError: (error: unknown) => {
          const message =
            error instanceof Error ? error.message : "Could not add this item to your cart";
          setValidationMessage(message);
          toast.error(message);
        },
      }
    );
  };

  const handleToggleWishlist = () => {
    if (!session) {
      requireLogin();
      return;
    }
    if (!selectedSize) {
      setValidationMessage("Select a colour and size before saving this item.");
      return;
    }
    if (addToWishlist.isPending || removeFromWishlist.isPending) return;
    if (isWishlisted) removeFromWishlist.mutate(selectedSize.id);
    else addToWishlist.mutate(selectedSize.id);
  };

  // The gallery shows the selected colour's own images, never another
  // colour's; before a colour is picked it falls back to the Item's default
  // images, then the Style's.
  const galleryImages: GalleryImage[] = useMemo(() => {
    const source =
      (selectedColorId && selectedColor?.images.length ? selectedColor.images : null) ??
      (selectedItem?.images.length ? selectedItem.images : null) ??
      (style.images.length ? style.images : []);

    if (source.length > 0) {
      return source.map((img) => ({
        id: img.id,
        url: getImageUrl(img.imageUrl),
        altText: selectedColor?.colorName || selectedItem?.name || style.name,
      }));
    }
    return style.image
      ? [{ id: style.id, url: getImageUrl(style.image), altText: style.name }]
      : [];
  }, [selectedColorId, selectedColor, selectedItem, style]);

  const isInStock = selectedSize ? selectedSize.inStock : (selectedItem?.inStock ?? false);

  const description = selectedItem?.description || style.description || null;

  if (!selectedItem) {
    return (
      <div className="rounded-2xl border border-theme-border bg-theme-surface p-10 text-center">
        <h2 className="text-lg font-bold text-theme-text-primary">{style.name}</h2>
        <p className="mt-2 text-sm text-theme-text-subtle">
          This style has no items available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* The Items under this Style - only worth a picker when there are several */}
      {hasMultipleItems && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-theme-text-primary">
              Items in {style.name}
            </h2>
            <p className="mt-1 text-sm text-theme-text-subtle">
              Pick an item to see its colours, sizes and prices.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <StyleItemCard
                key={item.id}
                item={item}
                isSelected={item.id === selectedItem.id}
                onSelect={handleSelectItem}
              />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Gallery - remounted per colour so it opens on that colour's first image */}
        <div className="lg:col-span-6">
          <ProductGallery
            key={selectedColorId ?? selectedItem.id}
            images={galleryImages}
            productName={selectedItem.name || style.name}
            isVeg={style.vegType === "veg"}
            isInStock={isInStock}
            showQualitySeal={false}
          />
        </div>

        {/* Style + selected Item details */}
        <div className="space-y-6 lg:col-span-6">
          <div className="space-y-1.5">
            {style.brand && (
              <span className="text-xs font-bold uppercase tracking-wide text-theme-primary">
                {style.brand.name}
              </span>
            )}
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-theme-text-primary sm:text-3xl">
              {style.name}
            </h1>
            {hasMultipleItems && (
              <p className="text-sm font-semibold text-theme-text-subtle">
                {selectedItem.name}
              </p>
            )}
            {style.shortDescription && (
              <p className="pt-1 text-sm text-theme-text-subtle">{style.shortDescription}</p>
            )}
          </div>

          <ItemPurchasePanel
            item={selectedItem}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            quantity={quantity}
            validationMessage={validationMessage}
            isAdding={addToCart.isPending}
            isWishlisted={isWishlisted}
            onSelectColor={handleSelectColor}
            onSelectSize={handleSelectSize}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
          />

          {description && (
            <div
              className="prose-sm max-w-none border-t border-theme-border-subtle pt-5 text-sm leading-relaxed text-theme-text-subtle"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(description) }}
            />
          )}
        </div>
      </div>

      <ProductReviewsSection
        variantId={selectedColor?.id ?? null}
        variantName={selectedColor?.colorName ?? selectedItem.name}
        productName={style.name}
        productIdOrSlug={style.id}
        selectedUnitPriceId={selectedSize?.id ?? null}
        packSizes={sizes}
      />
    </div>
  );
}

export default StyleDetailView;
