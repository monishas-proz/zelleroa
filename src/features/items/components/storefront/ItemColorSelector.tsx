"use client";

import { Check } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import { ProductImage } from "@/components/common/ProductImage";
import type { CustomerVariantListItemDto } from "@/features/customers/types/catalog.types";

interface ItemColorSelectorProps {
  colors: CustomerVariantListItemDto[];
  selectedColorId: string | null;
  onSelect: (colorId: string) => void;
}

function isSellable(color: CustomerVariantListItemDto): boolean {
  return !color.outOfStock && color.unitPrices.some((up) => up.inStock);
}

/**
 * The Item's Colors. Selecting one drives the whole page - gallery, Sizes,
 * stock and price all follow it. Sold-out Colors stay visible but are struck
 * through, so the shopper can see the Item exists in that Color.
 */
export function ItemColorSelector({
  colors,
  selectedColorId,
  onSelect,
}: ItemColorSelectorProps) {
  if (colors.length === 0) return null;

  const selected = colors.find((color) => color.id === selectedColorId) ?? null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline gap-2">
        <h3 className="text-sm font-bold text-theme-text-primary">Colour</h3>
        {selected?.colorName && (
          <span className="text-sm text-theme-text-subtle">{selected.colorName}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Colour">
        {colors.map((color) => {
          const isSelected = color.id === selectedColorId;
          const sellable = isSellable(color);
          const label = color.colorName || color.variantName || "Colour";
          const swatchImage = color.images[0]?.imageUrl ?? color.primaryImage;

          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={sellable ? label : `${label} (out of stock)`}
              title={label}
              onClick={() => onSelect(color.id)}
              className={cn(
                "relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer",
                isSelected
                  ? "border-theme-primary ring-2 ring-theme-primary/20"
                  : "border-theme-border hover:border-theme-primary/40",
                !sellable && "opacity-50"
              )}
            >
              {swatchImage ? (
                <ProductImage
                  src={getImageUrl(swatchImage)}
                  alt={label}
                  fallbackText={label}
                  containerClassName="w-full h-full"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  className="block h-full w-full"
                  style={{ backgroundColor: color.colorHex || "var(--theme-surface-alt)" }}
                />
              )}

              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <Check className="h-5 w-5 text-white" strokeWidth={3} />
                </span>
              )}
              {!sellable && (
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_47%,currentColor_47%,currentColor_53%,transparent_53%)] text-theme-text-subtle"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ItemColorSelector;
