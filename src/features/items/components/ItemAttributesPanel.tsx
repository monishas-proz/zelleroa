"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useItemAttributeValues, useSetAttributeValuesForItem } from "@/features/attributes/hooks";
import { useUnits } from "@/features/units/hooks";
import { useGenerateVariantsFromItem } from "@/features/variants/hooks";
import type { AdminUnitResponse } from "@/features/units/types";
import type { GenerateVariantsResponse } from "@/features/variants/types";
import type { ItemAttributeGroup } from "@/features/attributes/types";
import { AttributeValueQuickAdd } from "@/features/attributes/components/AttributeValueQuickAdd";
import { ItemColorImagesManager } from "./ItemColorImagesManager";

interface ItemAttributesPanelProps {
  productUuid: string;
  itemUuid: string;
  /** Used by the Color Images section below to build a readable slug when
   * auto-creating a Color that doesn't have a variant yet. */
  itemSlug?: string;
  /** Called after a successful "Generate Variants" run so the parent can refetch Colors/Sizes. */
  onGenerated?: () => void;
}

// Stable reference so the sync effect below doesn't re-fire every render
// while the query has no data yet (a fresh `[]` literal on every render would
// change the effect's dependency each time and loop forever).
const EMPTY_GROUPS: ItemAttributeGroup[] = [];

/**
 * Item-level "which values apply" selection, scoped to whatever attributes are
 * configured on the parent Product (ProductAttributesPanel). No "add attribute"
 * picker here on purpose - the admin only ever picks values (e.g. Color: Black,
 * White) for the attributes the Product already defines. Saving triggers the
 * existing Color x Size generation engine straight from this selection.
 */
function ItemAttributesPanel({
  productUuid,
  itemUuid,
  itemSlug,
  onGenerated,
}: ItemAttributesPanelProps) {
  const {
    data: groups = EMPTY_GROUPS,
    isLoading,
    error: groupsError,
    refetch: refetchGroups,
  } = useItemAttributeValues(productUuid, itemUuid);
  const setValuesMutation = useSetAttributeValuesForItem();
  const { data: unitsData } = useUnits({ pageSize: 100 });
  const units = unitsData?.data ?? [];
  const generateMutation = useGenerateVariantsFromItem();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isDirty, setIsDirty] = useState(false);
  const [unitId, setUnitId] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [defaultStock, setDefaultStock] = useState("0");
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateVariantsResponse | null>(null);

  useEffect(() => {
    if (isDirty) return;
    const next = new Set<string>();
    for (const group of groups) {
      const groupSelected = group.values.filter((value) => value.selected);
      if (!group.multipleSelection && groupSelected.length > 1) {
        next.add(groupSelected[0].id);
      } else {
        for (const value of groupSelected) next.add(value.id);
      }
    }
    setSelected(next);
  }, [groups, isDirty]);

  const toggle = (group: ItemAttributeGroup, valueId: string) => {
    setIsDirty(true);
    setResult(null);
    setSelected((prev) => {
      const next = new Set(prev);

      if (!group.multipleSelection) {
        // Single-selection attribute (Attribute Master "Multiple Selection" =
        // OFF): picking a value replaces every other selection in the group.
        const groupIds = new Set(group.values.map((value) => value.id));
        for (const id of groupIds) next.delete(id);
        if (!prev.has(valueId)) next.add(valueId);
        return next;
      }

      if (next.has(valueId)) next.delete(valueId);
      else next.add(valueId);
      return next;
    });
  };

  // A value created right here from the quick-add form is pre-selected, so the
  // admin doesn't have to hunt for the chip they just made. Marking the panel
  // dirty also stops the refetched groups from wiping the pick before Save.
  const selectNewValue = (group: ItemAttributeGroup, valueId: string) => {
    setIsDirty(true);
    setResult(null);
    setSelected((prev) => {
      const next = new Set(prev);
      if (!group.multipleSelection) {
        for (const value of group.values) next.delete(value.id);
      }
      next.add(valueId);
      return next;
    });
  };

  // Live "Selected Values" summary - groups the currently selected value IDs
  // back under their attribute so the table below shows one row per attribute
  // (chips per value) instead of scattering values across separate rows.
  const summaryRows = groups
    .map((group) => {
      const selectedValues = group.values.filter((value) => selected.has(value.id));
      return { group, selectedValues };
    })
    .filter((row) => row.selectedValues.length > 0);

  const selectionCount = summaryRows.reduce((sum, row) => sum + row.selectedValues.length, 0);

  const saveSelection = async () => {
    setFormError(null);

    // Single-selection attributes may only ever hold one value - enforced in
    // the UI by the radio behaviour and again server-side on save.
    for (const group of groups) {
      if (group.multipleSelection) continue;
      const picked = group.values.filter((value) => selected.has(value.id));
      if (picked.length > 1) {
        setFormError(`Only one value can be selected for "${group.name}".`);
        return;
      }
    }

    try {
      await setValuesMutation.mutateAsync({
        productUuid,
        itemUuid,
        attributeValueIds: [...selected],
      });
      setIsDirty(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save attribute values");
    }
  };

  const handleGenerate = async () => {
    setFormError(null);
    setResult(null);

    if (isDirty) {
      setFormError("Save the attribute value selection above before generating variants");
      return;
    }
    if (selected.size === 0) {
      setFormError("Select at least one attribute value first");
      return;
    }
    if (!unitId) {
      setFormError("Please select a unit");
      return;
    }
    const trimmedPrice = defaultPrice.trim();
    if (trimmedPrice !== "" && (Number.isNaN(Number(trimmedPrice)) || Number(trimmedPrice) < 0)) {
      setFormError("Price cannot be negative");
      return;
    }
    const stock = Number(defaultStock);
    if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      setFormError("Stock must be a non-negative whole number");
      return;
    }

    try {
      const response = await generateMutation.mutateAsync({
        productUuid,
        itemUuid,
        data: {
          unitId,
          ...(trimmedPrice !== "" ? { defaultPrice: Number(trimmedPrice) } : {}),
          defaultStock: stock,
          activate: true,
        },
      });
      const data = (response as { data?: GenerateVariantsResponse }).data ?? response;
      setResult(data as GenerateVariantsResponse);
      onGenerated?.();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to generate variants");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center text-neutral-400">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (groupsError) {
    return (
      <div className="p-4 rounded-xl border border-error-200 bg-error-50 text-error-700 text-xs flex items-start gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">
            {groupsError instanceof Error ? groupsError.message : "Failed to load attributes"}
          </p>
          <button
            type="button"
            onClick={() => refetchGroups()}
            className="underline font-medium hover:text-error-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <p className="text-xs text-neutral-400 italic p-4">
        This product has no attributes configured yet. Configure Color, Size, etc. on the product
        first, then come back here to pick values for this item.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-neutral-500">
        Pick the values this item comes in. Colors get their own image gallery once generated
        below; every Color x Size combination becomes its own variant with its own price, stock
        and SKU.
      </p>

      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className="block text-xs font-semibold text-neutral-800">
                {group.name}
              </label>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  group.multipleSelection
                    ? "bg-secondary-50 text-secondary-700"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {group.multipleSelection ? "Multiple values" : "Select one"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const isChecked = selected.has(value.id);
                return (
                  <button
                    key={value.id}
                    type="button"
                    onClick={() => toggle(group, value.id)}
                    disabled={setValuesMutation.isPending}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer select-none disabled:opacity-50 ${
                      isChecked
                        ? "border-secondary-600 bg-secondary-600 text-white shadow-xs"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
                    }`}
                  >
                    {!group.multipleSelection && (
                      <span
                        className={`flex h-3 w-3 items-center justify-center rounded-full border ${
                          isChecked ? "border-white" : "border-neutral-400"
                        }`}
                      >
                        {isChecked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                    )}
                    {group.type === "color" &&
                      (value.imageUrl ? (
                        <img
                          src={value.imageUrl}
                          alt=""
                          className="h-4 w-4 rounded-full border border-white/60 object-cover"
                        />
                      ) : (
                        value.colorHex && (
                          <span
                            className="h-3 w-3 rounded-full border border-white/60"
                            style={{ backgroundColor: value.colorHex }}
                          />
                        )
                      ))}
                    {value.value}
                  </button>
                );
              })}
            </div>
            <AttributeValueQuickAdd
              attributeUuid={group.id}
              attributeName={group.name}
              type={group.type}
              disabled={setValuesMutation.isPending}
              onAdded={(valueId) => {
                if (valueId) selectNewValue(group, valueId);
                refetchGroups();
              }}
            />
          </div>
        ))}
      </div>

      {/* Selected Values table - one row per attribute, every picked value as a
          chip in the same cell (never spread across separate attribute rows). */}
      {summaryRows.length > 0 && (
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-neutral-800">Selected Values</p>
            <span className="inline-flex items-center rounded-full bg-secondary-50 text-secondary-700 px-2 py-0.5 text-[10px] font-semibold">
              {selectionCount} value{selectionCount === 1 ? "" : "s"}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                  <th className="px-4 py-2.5 min-w-[140px] border-b border-cream-border">Attribute</th>
                  <th className="px-4 py-2.5 min-w-[220px] border-b border-cream-border">Selected Values</th>
                  <th className="px-4 py-2.5 min-w-[110px] border-b border-cream-border">Selection Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {summaryRows.map(({ group, selectedValues }) => (
                  <tr key={group.id}>
                    <td className="px-4 py-2.5 align-top">
                      <span className="font-semibold text-neutral-900">{group.name}</span>
                    </td>
                    <td className="px-4 py-2.5 align-top">
                      <div className="flex flex-wrap gap-1.5">
                        {selectedValues.map((value) => (
                          <span
                            key={value.id}
                            className="inline-flex items-center gap-1.5 rounded-full bg-secondary-50 text-secondary-700 border border-secondary-200 px-2.5 py-1 text-xs font-semibold"
                          >
                            {group.type === "color" &&
                              (value.imageUrl ? (
                                <img
                                  src={value.imageUrl}
                                  alt=""
                                  className="h-3.5 w-3.5 rounded-full border border-white/60 object-cover"
                                />
                              ) : (
                                value.colorHex && (
                                  <span
                                    className="h-3 w-3 rounded-full border border-white/60"
                                    style={{ backgroundColor: value.colorHex }}
                                  />
                                )
                              ))}
                            {value.value}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 align-top">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          group.multipleSelection
                            ? "bg-secondary-50 text-secondary-700"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {group.multipleSelection ? "Multiple" : "Single"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={saveSelection}
          disabled={!isDirty || setValuesMutation.isPending}
          variant="outline"
          className="h-9 rounded-xl px-4 text-xs font-semibold cursor-pointer"
        >
          {setValuesMutation.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
          ) : (
            <Save className="w-3.5 h-3.5 mr-1.5" />
          )}
          Save Selection
        </Button>
      </div>

      <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
        <p className="text-xs font-semibold text-neutral-800">Generate Variants</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              disabled={generateMutation.isPending}
              className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary-600/20 focus:border-secondary-600 disabled:opacity-60"
            >
              <option value="">Select unit</option>
              {units.map((u: AdminUnitResponse) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
              Default price (₹)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={defaultPrice}
              onChange={(e) => setDefaultPrice(e.target.value)}
              disabled={generateMutation.isPending}
              placeholder="e.g. 799"
              className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary-600/20 focus:border-secondary-600 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
              Default stock
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={defaultStock}
              onChange={(e) => setDefaultStock(e.target.value)}
              disabled={generateMutation.isPending}
              className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary-600/20 focus:border-secondary-600 disabled:opacity-60"
            />
          </div>
        </div>

        {formError && (
          <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> {formError}
          </p>
        )}

        {result && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {result.created} color{result.created === 1 ? "" : "s"} created
              </p>
              {result.skipped > 0 && (
                <p className="mt-0.5">
                  {result.skipped} combination{result.skipped === 1 ? "" : "s"} already existed
                  and were skipped.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={generateMutation.isPending || selected.size === 0}
            className="h-10 rounded-xl bg-[var(--color-secondary-600)] px-5 text-sm font-semibold text-white hover:bg-[var(--color-secondary-700)] cursor-pointer"
          >
            {generateMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            )}
            Generate Variants
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
        <p className="text-xs font-semibold text-neutral-800">Color Images</p>
        <ItemColorImagesManager productUuid={productUuid} itemUuid={itemUuid} itemSlug={itemSlug} />
      </div>
    </div>
  );
}

export { ItemAttributesPanel };
