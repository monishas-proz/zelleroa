"use client";

import { useMemo, useState } from "react";
import { Images as ImagesIcon, ChevronDown, ChevronUp, Loader2, Plus } from "lucide-react";
import { useVariants, useCreateVariant } from "@/features/variants/hooks";
import { VariantImageUploader } from "@/features/variants/components";
import { useItemAttributeValues } from "@/features/attributes/hooks";
import type { AdminVariantResponse } from "@/features/variants/types";

interface ItemColorImagesManagerProps {
  productUuid: string;
  itemUuid: string;
  /** Used to build a readable, product-unique slug when auto-creating a
   * Color for a value that has no variant yet. Falls back to itemUuid. */
  itemSlug?: string;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "");
}

/**
 * Item -> Color -> Multiple Images, all in one place. Lists every Colour
 * value already picked on this Item (via the attribute-value selector above),
 * not just the ones that already have a real Color variant/SKU - clicking a
 * not-yet-created one creates it on the spot (no separate "Generate Variants"
 * detour needed just to get to the upload button) and opens its uploader.
 */
function ItemColorImagesManager({ productUuid, itemUuid, itemSlug }: ItemColorImagesManagerProps) {
  const {
    data: variantsResponse,
    isLoading: isLoadingVariants,
    refetch: refetchVariants,
  } = useVariants(
    { productIds: [productUuid], pageSize: 100 },
    { enabled: !!productUuid }
  );
  const variants = useMemo<AdminVariantResponse[]>(
    () => (variantsResponse?.data ?? []).filter((v) => v.itemId === itemUuid),
    [variantsResponse, itemUuid]
  );

  const { data: groups = [], isLoading: isLoadingValues } = useItemAttributeValues(
    productUuid,
    itemUuid
  );
  const selectedColorValues = useMemo(
    () =>
      groups
        .filter((g) => g.type === "color")
        .flatMap((g) => g.values.filter((v) => v.selected)),
    [groups]
  );

  const rows = useMemo(
    () =>
      selectedColorValues.map((value) => ({
        value,
        variant: variants.find(
          (v) => (v.colorName || "").trim().toLowerCase() === value.value.trim().toLowerCase()
        ),
      })),
    [selectedColorValues, variants]
  );

  const createVariantMutation = useCreateVariant();
  const [creatingValueId, setCreatingValueId] = useState<string | null>(null);
  const [openVariantId, setOpenVariantId] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreateAndOpen = async (valueId: string, valueName: string) => {
    setCreateError(null);
    setCreatingValueId(valueId);
    try {
      const base = `${itemSlug || itemUuid}-${slugify(valueName)}`.slice(0, 230);
      let slug = base;
      let created: AdminVariantResponse | undefined;
      for (let attempt = 1; attempt <= 4 && !created; attempt += 1) {
        try {
          const res = await createVariantMutation.mutateAsync({
            productUuid,
            itemUuid,
            data: {
              variantName: valueName,
              slug,
              priceAdjustment: 0,
              isFeatured: false,
              attributeValueIds: [valueId],
            },
          });
          created = (res as { data?: AdminVariantResponse })?.data;
        } catch (err) {
          const message = err instanceof Error ? err.message : "";
          if (message.toLowerCase().includes("slug") && attempt < 4) {
            slug = `${base}-${attempt + 1}`;
            continue;
          }
          throw err;
        }
      }
      if (created) {
        await refetchVariants();
        setOpenVariantId(created.id);
      }
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : `Failed to create "${valueName}"`);
    } finally {
      setCreatingValueId(null);
    }
  };

  if (isLoadingVariants || isLoadingValues) {
    return <p className="text-xs text-neutral-400 italic p-4">Loading colors...</p>;
  }

  if (rows.length === 0) {
    return (
      <p className="text-xs text-neutral-400 italic p-4">
        No Colour values picked for this Item yet. Select values above and save, then come back
        here to upload images for each one.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-neutral-500">
        Upload images separately for each Colour. Images uploaded under one Colour never appear
        under another.
      </p>

      {createError && <p className="text-xs font-medium text-error-600">{createError}</p>}

      {rows.map(({ value, variant }) => {
        const isOpen = variant ? openVariantId === variant.id : false;
        const isCreatingThis = creatingValueId === value.id;
        return (
          <div key={value.id} className="rounded-xl border border-neutral-200 overflow-hidden">
            <button
              type="button"
              onClick={() =>
                variant
                  ? setOpenVariantId(isOpen ? null : variant.id)
                  : handleCreateAndOpen(value.id, value.value)
              }
              disabled={isCreatingThis}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer text-left disabled:opacity-60"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                {value.imageUrl ? (
                  <img
                    src={value.imageUrl}
                    alt=""
                    className="h-4 w-4 rounded-full border border-white shadow-sm flex-none object-cover"
                  />
                ) : (
                  value.colorHex && (
                    <span
                      className="h-4 w-4 rounded-full border border-white shadow-sm flex-none"
                      style={{ backgroundColor: value.colorHex }}
                    />
                  )
                )}
                <span className="text-sm font-semibold text-neutral-900 truncate">
                  {value.value}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400">
                  <ImagesIcon className="h-3 w-3" />
                  {!variant
                    ? "Not created yet - click to add"
                    : variant.primaryImage
                    ? "Has images"
                    : "No images yet"}
                </span>
              </span>
              {isCreatingThis ? (
                <Loader2 className="h-4 w-4 animate-spin text-neutral-400 flex-none" />
              ) : !variant ? (
                <Plus className="h-4 w-4 text-neutral-500 flex-none" />
              ) : isOpen ? (
                <ChevronUp className="h-4 w-4 text-neutral-500 flex-none" />
              ) : (
                <ChevronDown className="h-4 w-4 text-neutral-500 flex-none" />
              )}
            </button>

            {isOpen && variant && (
              <div className="p-4 border-t border-neutral-200">
                <VariantImageUploader
                  productUuid={productUuid}
                  variantUuid={variant.id}
                  variantName={variant.colorName || variant.variantName}
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
