"use client";

import { useMemo, useState } from "react";
import { Images as ImagesIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useVariants } from "@/features/variants/hooks";
import { VariantImageUploader } from "@/features/variants/components";
import type { AdminVariantResponse } from "@/features/variants/types";

interface ItemColorImagesManagerProps {
  productUuid: string;
  itemUuid: string;
}

/**
 * Item -> Color -> Multiple Images, all in one place. Each Color here IS a
 * ProductVariant row (color_name/color_hex) - this just surfaces the existing
 * per-variant VariantImageUploader for every Color under the Item at once,
 * instead of requiring the admin to open a separate "Manage Images" modal per
 * Color from the variants table one at a time.
 */
function ItemColorImagesManager({ productUuid, itemUuid }: ItemColorImagesManagerProps) {
  const { data: variantsResponse, isLoading } = useVariants(
    { productIds: [productUuid], pageSize: 100 },
    { enabled: !!productUuid }
  );

  const colors = useMemo<AdminVariantResponse[]>(
    () => (variantsResponse?.data ?? []).filter((v) => v.itemId === itemUuid),
    [variantsResponse, itemUuid]
  );

  const [openColorId, setOpenColorId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <p className="text-xs text-neutral-400 italic p-4">Loading colors...</p>
    );
  }

  if (colors.length === 0) {
    return (
      <p className="text-xs text-neutral-400 italic p-4">
        No Colors yet for this Item. Generate Colors above first, then come back here to upload
        images for each one.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-neutral-500">
        Upload images separately for each Color. Images uploaded under one Color never appear
        under another.
      </p>

      {colors.map((color) => {
        const isOpen = openColorId === color.id;
        return (
          <div
            key={color.id}
            className="rounded-xl border border-neutral-200 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenColorId(isOpen ? null : color.id)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer text-left"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                {color.colorHex && (
                  <span
                    className="h-4 w-4 rounded-full border border-white shadow-sm flex-none"
                    style={{ backgroundColor: color.colorHex }}
                  />
                )}
                <span className="text-sm font-semibold text-neutral-900 truncate">
                  {color.colorName || color.variantName}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400">
                  <ImagesIcon className="h-3 w-3" />
                  {color.primaryImage ? "Has images" : "No images yet"}
                </span>
              </span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-neutral-500 flex-none" />
              ) : (
                <ChevronDown className="h-4 w-4 text-neutral-500 flex-none" />
              )}
            </button>

            {isOpen && (
              <div className="p-4 border-t border-neutral-200">
                <VariantImageUploader
                  productUuid={productUuid}
                  variantUuid={color.id}
                  variantName={color.colorName || color.variantName}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export { ItemColorImagesManager };
