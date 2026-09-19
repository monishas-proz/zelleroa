"use client";

import { Check } from "lucide-react";
import { ProductImage } from "@/components/common/ProductImage";
import { cn, formatPrice, getImageUrl } from "@/lib/utils";
import type { CustomerStyleItemDto } from "@/features/customers/types/catalog.types";

interface StyleItemCardProps {
  item: CustomerStyleItemDto;
  isSelected: boolean;
  onSelect: (itemId: string) => void;
}

/**
 * One Item under a Style, as shown on the Style detail page. Selecting it
 * reveals its Colors/Sizes in the purchase panel below - the Item itself is
 * never added to the cart, only a Color+Size combination of it is.
 */
export function StyleItemCard({ item, isSelected, onSelect }: StyleItemCardProps) {
  const colorCount = item.colors.filter((c) => c.colorName).length;
  const priceLabel =
    item.maxPrice > item.minPrice
      ? `${formatPrice(item.minPrice)} - ${formatPrice(item.maxPrice)}`
      : formatPrice(item.minPrice);

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-pressed={isSelected}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-theme-surface text-left transition-all cursor-pointer",
        isSelected
          ? "border-theme-primary ring-2 ring-theme-primary/20 shadow-md"
          : "border-theme-border hover:border-theme-primary/40 hover:shadow-xs"
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-theme-surface-alt">
        <ProductImage
          src={item.image ? getImageUrl(item.image) : null}
          alt={item.name}
          fallbackText={item.name}
          containerClassName="w-full h-full aspect-square"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isSelected && (
          <span className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-theme-primary text-theme-primary-fg shadow-xs">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        )}
        {!item.inStock && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700 border border-rose-200">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h4 className="text-sm font-bold leading-tight text-theme-text-primary line-clamp-2">
          {item.name}
        </h4>
        <span className="text-sm font-bold text-theme-text-primary">{priceLabel}</span>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] font-semibold text-theme-text-subtle">
          {colorCount > 0 && <span>{colorCount} color{colorCount === 1 ? "" : "s"}</span>}
          {item.hasSizes && <span>Multiple sizes</span>}
        </div>
      </div>
    </button>
  );
}

export default StyleItemCard;
