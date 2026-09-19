"use client";

import { useMemo } from "react";
import type {
  CustomerStyleItemDto,
  CustomerVariantListItemDto,
} from "@/features/customers/types/catalog.types";

interface ItemAttributeFactsProps {
  item: CustomerStyleItemDto;
  selectedColor: CustomerVariantListItemDto | null;
}

/**
 * The Item's extra attributes - Material, Fit, Pattern and whatever else the
 * catalog carries. They come from two places and are merged here: the Item's
 * own attributes (true of every Colour) and the selected Colour's, which can
 * differ between Colours. Colour and Size are excluded; they have their own
 * selectors. Renders nothing when the Item has no extra attributes at all.
 */
export function ItemAttributeFacts({ item, selectedColor }: ItemAttributeFactsProps) {
  const facts = useMemo(() => {
    const byName = new Map<string, Set<string>>();

    const add = (attributeName: string, value: string) => {
      const name = attributeName.trim();
      const key = name.toLowerCase();
      if (!name || !value || key === "color" || key === "colour" || key === "size") {
        return;
      }
      if (!byName.has(name)) byName.set(name, new Set());
      byName.get(name)!.add(value);
    };

    for (const attribute of item.attributes ?? []) {
      add(attribute.attributeName, attribute.value);
    }
    for (const attribute of selectedColor?.attributeValues ?? []) {
      add(attribute.attributeName, attribute.value);
    }

    return [...byName.entries()].map(([name, values]) => ({
      name,
      value: [...values].join(", "),
    }));
  }, [item.attributes, selectedColor]);

  if (facts.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <h3 className="text-sm font-bold text-theme-text-primary">Product details</h3>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {facts.map((fact) => (
          <div
            key={fact.name}
            className="flex items-baseline justify-between gap-3 border-b border-theme-border-subtle py-1.5"
          >
            <dt className="text-xs font-semibold uppercase tracking-wide text-theme-text-subtle">
              {fact.name}
            </dt>
            <dd className="text-sm font-medium text-theme-text-primary text-right">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default ItemAttributeFacts;
