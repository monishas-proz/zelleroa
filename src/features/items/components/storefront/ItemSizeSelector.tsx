"use client";

import { cn, formatPrice } from "@/lib/utils";
import type { CustomerVariantUnitPriceDto } from "@/features/customers/types/catalog.types";

interface ItemSizeSelectorProps {
  sizes: CustomerVariantUnitPriceDto[];
  selectedSizeId: string | null;
  onSelect: (sizeId: string) => void;
  /** Shown beside the heading, e.g. a size guide link. */
  action?: React.ReactNode;
}

/**
 * The Sizes of the currently selected Colour - each its own row with its own
 * price and stock. Sold-out sizes are rendered disabled rather than hidden, so
 * the shopper can tell the size exists but is unavailable in this Colour.
 *
 * The caller decides whether to render this at all: a Colour with no Sizes has
 * nothing to pick, so the section is left out entirely.
 */
export function ItemSizeSelector({
  sizes,
  selectedSizeId,
  onSelect,
  action,
}: ItemSizeSelectorProps) {
  if (sizes.length === 0) return null;

  // Sizes can differ in price within one Colour; when they do, the chips say so
  // rather than letting the headline price silently change on selection.
  const prices = new Set(sizes.map((size) => size.sellingPrice));
  const showPricePerSize = prices.size > 1;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-theme-text-primary">Size</h3>
        {action}
      </div>

      <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Size">
        {sizes.map((size) => {
          const isSelected = size.id === selectedSizeId;

          return (
            <button
              key={size.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={size.inStock ? size.label : `${size.label} (out of stock)`}
              disabled={!size.inStock}
              onClick={() => onSelect(size.id)}
              className={cn(
                "min-w-14 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-all",
                isSelected
                  ? "border-theme-primary bg-theme-primary text-theme-primary-fg"
                  : "border-theme-border bg-theme-surface text-theme-text-primary hover:border-theme-primary/50",
                size.inStock
                  ? "cursor-pointer"
                  : "cursor-not-allowed text-theme-text-subtle line-through opacity-50 hover:border-theme-border"
              )}
            >
              <span className="block leading-tight">{size.label}</span>
              {showPricePerSize && (
                <span
                  className={cn(
                    "mt-0.5 block text-[11px] font-medium",
                    isSelected ? "text-theme-primary-fg/80" : "text-theme-text-subtle"
                  )}
                >
                  {formatPrice(size.sellingPrice)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {sizes.some((size) => !size.inStock) && (
        <p className="text-xs text-theme-text-subtle">
          Struck-through sizes are out of stock in this colour.
        </p>
      )}
    </div>
  );
}

export default ItemSizeSelector;
