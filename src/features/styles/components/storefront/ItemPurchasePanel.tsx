"use client";

import { useMemo } from "react";
import { Check, Loader2, Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import { cn, formatPrice, getImageUrl } from "@/lib/utils";
import { ProductImage } from "@/components/common/ProductImage";
import type {
  CustomerStyleItemDto,
  CustomerVariantListItemDto,
  CustomerVariantUnitPriceDto,
} from "@/features/customers/types/catalog.types";

export interface ItemPurchasePanelProps {
  item: CustomerStyleItemDto;
  selectedColor: CustomerVariantListItemDto | null;
  selectedSize: CustomerVariantUnitPriceDto | null;
  quantity: number;
  validationMessage: string | null;
  isAdding: boolean;
  isWishlisted: boolean;
  onSelectColor: (colorId: string) => void;
  onSelectSize: (unitPriceId: string) => void;
  onQuantityChange: (next: number) => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
}

/**
 * The buy box for one Item: its Colors, the Sizes configured for whichever
 * Color is selected, and the price/stock of that exact combination.
 *
 * Every dimension is read from the data, never assumed: an Item may have one
 * Color or twenty, a Color may carry Sizes or none at all, and each
 * Color+Size row has its own price and stock.
 */
export function ItemPurchasePanel({
  item,
  selectedColor,
  selectedSize,
  quantity,
  validationMessage,
  isAdding,
  isWishlisted,
  onSelectColor,
  onSelectSize,
  onQuantityChange,
  onAddToCart,
  onToggleWishlist,
}: ItemPurchasePanelProps) {
  // Colors are only offered when the admin actually split this Item by color.
  const colors = useMemo(() => item.colors.filter((c) => c.colorName), [item.colors]);
  const hasColors = colors.length > 0;
  const needsColorChoice = colors.length > 1;

  // Sizes belong to the selected Color - never to the Item - so a Color with
  // no size rows simply shows no size section.
  const sizes = selectedColor?.unitPrices ?? [];
  const hasNamedSizes = sizes.some((s) => s.sizeId !== null);
  const showSizeSection = sizes.length > 1 || hasNamedSizes;
  const sizeSectionLabel = hasNamedSizes ? "Size" : "Pack size";

  const colorInStock = (color: CustomerVariantListItemDto) =>
    !color.outOfStock && color.unitPrices.some((up) => up.inStock);

  // Price follows the exact selection: the chosen Size when there is one,
  // otherwise the range the chosen Color (or the whole Item) spans.
  const priceRange = useMemo(() => {
    const pool = selectedColor
      ? selectedColor.unitPrices.map((up) => up.sellingPrice)
      : [item.minPrice, item.maxPrice];
    const valid = pool.filter((p) => p > 0);
    if (valid.length === 0) return null;
    return { min: Math.min(...valid), max: Math.max(...valid) };
  }, [selectedColor, item.minPrice, item.maxPrice]);

  const sellingPrice = selectedSize?.sellingPrice ?? null;
  const basePrice = selectedSize?.basePrice ?? null;
  const hasDiscount =
    sellingPrice !== null && basePrice !== null && sellingPrice < basePrice;
  const discountPercent =
    hasDiscount && (basePrice as number) > 0
      ? Math.round((((basePrice as number) - (sellingPrice as number)) / (basePrice as number)) * 100)
      : 0;

  const maxQuantity = selectedSize ? Math.max(1, selectedSize.stock) : 99;
  const readyToAdd = !!selectedSize && selectedSize.inStock && (!hasColors || !!selectedColor);

  return (
    <div className="space-y-6">
      {/* Price - always reflects the exact selected combination */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-baseline gap-3">
          {sellingPrice !== null ? (
            <>
              <span className="text-3xl font-extrabold tracking-tight text-theme-text-primary">
                {formatPrice(sellingPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-theme-text-muted line-through">
                    {formatPrice(basePrice as number)}
                  </span>
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-amber-900">
                    {discountPercent}% off
                  </span>
                </>
              )}
            </>
          ) : priceRange ? (
            <span className="text-3xl font-extrabold tracking-tight text-theme-text-primary">
              {priceRange.max > priceRange.min
                ? `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`
                : formatPrice(priceRange.min)}
            </span>
          ) : (
            <span className="text-lg font-semibold text-theme-text-subtle">
              Price unavailable
            </span>
          )}
        </div>
      </div>

      {/* Colours */}
      {hasColors && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-theme-text-primary">
              Colour
              {selectedColor?.colorName && (
                <span className="ml-1.5 font-semibold text-theme-text-subtle">
                  {selectedColor.colorName}
                </span>
              )}
            </h3>
            <span className="text-xs text-theme-text-subtle">{colors.length} available</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {colors.map((color) => {
              const isSelected = color.id === selectedColor?.id;
              const inStock = colorInStock(color);
              const swatch = color.images[0]?.imageUrl || color.primaryImage;
              return (
                <button
                  key={color.id}
                  type="button"
                  disabled={!inStock}
                  onClick={() => onSelectColor(color.id)}
                  title={
                    inStock
                      ? color.colorName ?? ""
                      : `${color.colorName ?? "This colour"} - out of stock`
                  }
                  className={cn(
                    "group relative flex items-center gap-2 rounded-xl border px-2 py-1.5 pr-3 transition-all cursor-pointer",
                    isSelected
                      ? "border-theme-primary ring-2 ring-theme-primary/20 bg-theme-primary-light/40"
                      : "border-theme-border hover:border-theme-primary/50",
                    !inStock && "opacity-45 cursor-not-allowed line-through"
                  )}
                >
                  <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-theme-border">
                    {swatch ? (
                      <ProductImage
                        src={getImageUrl(swatch)}
                        alt={color.colorName ?? ""}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="block h-full w-full"
                        style={{ backgroundColor: color.colorHex || "#e5e5e5" }}
                      />
                    )}
                  </span>
                  <span className="text-xs font-bold text-theme-text-primary">
                    {color.colorName}
                  </span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-theme-primary" strokeWidth={3} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes - only the ones configured for the selected colour */}
      {selectedColor && showSizeSection && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-theme-text-primary">{sizeSectionLabel}</h3>
            {selectedSize && selectedSize.inStock && selectedSize.stock <= 5 && (
              <span className="text-xs font-semibold text-amber-700">
                Only {selectedSize.stock} left
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = size.id === selectedSize?.id;
              return (
                <button
                  key={size.id}
                  type="button"
                  disabled={!size.inStock}
                  onClick={() => onSelectSize(size.id)}
                  title={size.inStock ? size.label : `${size.label} - out of stock`}
                  className={cn(
                    "min-w-14 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all cursor-pointer",
                    isSelected
                      ? "border-theme-primary bg-theme-primary text-theme-primary-fg"
                      : "border-theme-border bg-theme-surface text-theme-text-primary hover:border-theme-primary/50",
                    !size.inStock &&
                      "cursor-not-allowed border-dashed opacity-45 line-through hover:border-theme-border"
                  )}
                >
                  {size.label}
                </button>
              );
            })}
          </div>

          {sizes.every((s) => !s.inStock) && (
            <p className="text-xs font-semibold text-rose-700">
              Every size of this colour is out of stock right now.
            </p>
          )}
        </div>
      )}

      {validationMessage && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700"
        >
          {validationMessage}
        </p>
      )}

      {/* Quantity + actions */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <div className="flex items-center rounded-xl border border-theme-border bg-theme-surface">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="flex h-11 w-11 items-center justify-center rounded-l-xl text-theme-text-primary transition-colors hover:bg-theme-surface-alt disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-bold text-theme-text-primary">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
            className="flex h-11 w-11 items-center justify-center rounded-r-xl text-theme-text-primary transition-colors hover:bg-theme-surface-alt disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onAddToCart}
          disabled={isAdding || (!!selectedSize && !selectedSize.inStock)}
          className="flex h-11 flex-1 min-w-48 items-center justify-center gap-2 rounded-xl bg-theme-primary px-6 text-sm font-bold uppercase tracking-wide text-theme-primary-fg transition-colors hover:bg-theme-primary-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isAdding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingBag className="h-4 w-4" />
          )}
          {selectedSize && !selectedSize.inStock ? "Out of stock" : "Add to cart"}
        </button>

        <button
          type="button"
          onClick={onToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-theme-border text-theme-text-primary transition-colors hover:border-theme-primary/50 cursor-pointer"
        >
          <Heart className={cn("h-5 w-5", isWishlisted && "fill-rose-500 text-rose-500")} />
        </button>
      </div>

      {!readyToAdd && !validationMessage && (
        <p className="text-xs text-theme-text-subtle">
          {needsColorChoice && !selectedColor
            ? "Pick a colour, then a size, to add this to your cart."
            : showSizeSection && !selectedSize
              ? `Pick a ${sizeSectionLabel.toLowerCase()} to add this to your cart.`
              : ""}
        </p>
      )}
    </div>
  );
}

export default ItemPurchasePanel;
