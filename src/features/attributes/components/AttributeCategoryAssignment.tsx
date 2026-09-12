"use client";

import { useState } from "react";
import { useCategories } from "@/features/categories/hooks";
import { useSetAttributeCategories } from "../hooks";
import type { AttributeListItem } from "../types";

interface AttributeCategoryAssignmentProps {
  attribute: AttributeListItem;
}

function AttributeCategoryAssignment({ attribute }: AttributeCategoryAssignmentProps) {
  const { data: categoriesData, isLoading } = useCategories({ pageSize: 100 });
  const categories = categoriesData?.data ?? [];

  const [selected, setSelected] = useState<Set<string>>(new Set(attribute.categoryIds));
  const [syncedCategoryIds, setSyncedCategoryIds] = useState(attribute.categoryIds);
  const setCategoriesMutation = useSetAttributeCategories();

  // Reset local selection whenever the attribute's saved category list changes
  // (e.g. after a successful save) — done during render, not in an effect, so
  // it takes effect before paint instead of causing an extra render pass.
  if (syncedCategoryIds !== attribute.categoryIds) {
    setSyncedCategoryIds(attribute.categoryIds);
    setSelected(new Set(attribute.categoryIds));
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const dirty =
    selected.size !== attribute.categoryIds.length ||
    ![...selected].every((id) => attribute.categoryIds.includes(id));

  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-500">
        Pick which categories should prompt for &ldquo;{attribute.name}&rdquo; when an admin adds
        a product (e.g. Fabric only applies to Dresses/Tops, not Watches).
      </p>

      {isLoading ? (
        <p className="text-sm text-neutral-400">Loading categories...</p>
      ) : (
        <div className="max-h-64 overflow-y-auto rounded-lg border border-neutral-200 p-2 grid grid-cols-2 gap-1.5">
          {categories.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.has(String(c.id))}
                onChange={() => toggle(String(c.id))}
                className="h-4 w-4 rounded border-neutral-300 text-secondary-600 focus:ring-secondary-600"
              />
              {c.name}
            </label>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!dirty || setCategoriesMutation.isPending}
          onClick={() =>
            setCategoriesMutation.mutate({
              attributeUuid: attribute.id,
              categoryIds: Array.from(selected),
            })
          }
          className="h-10 rounded-xl bg-secondary-600 px-5 text-sm font-semibold text-white hover:bg-secondary-700 disabled:opacity-40"
        >
          Save Categories
        </button>
      </div>
    </div>
  );
}

export { AttributeCategoryAssignment };
