"use client";

import { useState } from "react";
import { ChevronDown, ImageIcon, Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VariantImageUploader, VariantUnitPriceList } from "@/features/variants/components";
import { useVariantImages } from "@/features/variants/hooks";
import type { AdminVariantResponse } from "@/features/variants/types";
import type { AdminItemResponse } from "../types";
import { formatPrice } from "@/lib/utils";

interface ItemVariantDetailsProps {
  productUuid: string;
  categoryUuid?: string | null;
  items: AdminItemResponse[];
  variants: AdminVariantResponse[];
  colorLabel: string;
  sizeLabel: string;
  onEditItem: (item: AdminItemResponse) => void;
  onEditAttributes: (item: AdminItemResponse) => void;
  onDeleteItem: (item: AdminItemResponse) => void;
  onAddVariant: (item: AdminItemResponse) => void;
}

function VariantSection({
  productUuid,
  categoryUuid,
  variant,
  colorLabel,
  sizeLabel,
}: {
  productUuid: string;
  categoryUuid?: string | null;
  variant: AdminVariantResponse;
  colorLabel: string;
  sizeLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const { data: images = [] } = useVariantImages(productUuid, variant.id);
  const rows = variant.unitPrices ?? [];
  const label =
    variant.colorName ||
    variant.attributeValues?.map((value) => value.value).join(" / ") ||
    variant.variantName ||
    "Default variant";
  const swatch = variant.colorHex || undefined;

  return (
    <article className="overflow-hidden rounded-xl border border-cream-border bg-white">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-cream-50"
        aria-expanded={expanded}
      >
        <span
          className="h-4 w-4 shrink-0 rounded-full border border-neutral-300 shadow-inner"
          style={swatch ? { backgroundColor: swatch } : undefined}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-semibold text-neutral-900">{label}</span>
            {swatch && <span className="font-mono text-[11px] text-neutral-400">{swatch}</span>}
          </div>
          <p className="mt-0.5 text-xs text-neutral-500">
            {images.length} image{images.length === 1 ? "" : "s"} · {rows.length} {sizeLabel.toLowerCase()}{rows.length === 1 ? "" : "s"}
          </p>
        </div>
        <span className="hidden rounded-full bg-secondary-50 px-2 py-0.5 text-[10px] font-semibold text-secondary-700 sm:inline-flex">
          {colorLabel}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="space-y-5 border-t border-cream-border px-4 py-4 sm:px-5">
          <section>
            <div className="mb-2 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-secondary-600" />
              <h4 className="text-sm font-semibold text-neutral-900">{label} Images</h4>
            </div>
            <VariantImageUploader productUuid={productUuid} variantUuid={variant.id} variantName={label} />
          </section>

          <section className="border-t border-cream-border pt-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">{sizeLabel}, Price & Stock</h4>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Each row has its own price and available stock. Stock status is calculated automatically.
                </p>
              </div>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                {rows.length} variant{rows.length === 1 ? "" : "s"}
              </span>
            </div>
            <VariantUnitPriceList productUuid={productUuid} variantUuid={variant.id} categoryUuid={categoryUuid ?? null} />
          </section>
        </div>
      )}
    </article>
  );
}

function ItemVariantDetails({
  productUuid,
  categoryUuid,
  items,
  variants,
  colorLabel,
  sizeLabel,
  onEditItem,
  onEditAttributes,
  onDeleteItem,
  onAddVariant,
}: ItemVariantDetailsProps) {
  const prices = variants.flatMap((variant) => variant.unitPrices ?? []).map((price) => price.basePrice);
  const totalStock = variants.flatMap((variant) => variant.unitPrices ?? []).reduce((sum, price) => sum + (price.stock ?? 0), 0);
  const colorCount = new Set(variants.map((variant) => variant.colorName || variant.id)).size;

  return (
    <section className="overflow-hidden rounded-lg border border-cream-border bg-white">
      <div className="flex flex-col gap-3 border-b border-cream-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Variant Details</h2>
          <p className="mt-0.5 text-xs text-neutral-500">Manage color images, sizes, prices and stock for each variant.</p>
        </div>
        <span className="rounded-full bg-secondary-50 px-2.5 py-1 text-xs font-semibold text-secondary-700">
          {variants.length} color variant{variants.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px border-b border-cream-border bg-cream-border sm:grid-cols-4">
        {[
          ["Total Variants", String(variants.flatMap((variant) => variant.unitPrices ?? []).length)],
          ["Price Range", prices.length ? `${formatPrice(Math.min(...prices))} – ${formatPrice(Math.max(...prices))}` : "—"],
          ["Total Stock", String(totalStock)],
          [colorLabel, String(colorCount)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">{label}</p>
            <p className="mt-0.5 text-sm font-bold text-neutral-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        {items.map((item) => {
          const itemVariants = variants.filter((variant) => variant.itemId === item.id);
          return (
            <div key={item.id} className="rounded-xl border border-neutral-200 bg-neutral-50/40 p-3 sm:p-4">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">{item.name}</h3>
                  <p className="mt-0.5 font-mono text-[11px] text-neutral-500">{item.slug}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => onEditAttributes(item)}>
                    <Tags className="mr-1.5 h-3.5 w-3.5" /> Attributes
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEditItem(item)}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit Item
                  </Button>
                  <Button size="sm" onClick={() => onAddVariant(item)} className="bg-secondary-600 text-white hover:bg-secondary-700">
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Variant
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteItem(item)} title="Delete Item">
                    <Trash2 className="h-4 w-4 text-error-600" />
                  </Button>
                </div>
              </div>

              {itemVariants.length ? (
                <div className="space-y-2">
                  {itemVariants.map((variant) => (
                    <VariantSection
                      key={variant.id}
                      productUuid={productUuid}
                      categoryUuid={categoryUuid}
                      variant={variant}
                      colorLabel={colorLabel}
                      sizeLabel={sizeLabel}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-neutral-200 bg-white px-4 py-6 text-center">
                  <p className="text-sm font-semibold text-neutral-700">No variants generated yet</p>
                  <p className="mt-1 text-xs text-neutral-500">Select attribute values, then generate or add a variant for this item.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export { ItemVariantDetails };
