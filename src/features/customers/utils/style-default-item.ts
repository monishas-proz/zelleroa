/**
 * The Item a Style link lands on. The storefront never shows a page to choose
 * between a Style's Items - every Item has its own page (`/items/:id`) - so a
 * link that only names a Style (`/products/:styleId`, `/styles/:styleId`)
 * opens the Style's default Item, or its first when none is marked default.
 */
export function styleDefaultItemId(style: {
  items: Array<{ id: string; isDefault: boolean }>;
}): string | null {
  return (style.items.find((item) => item.isDefault) ?? style.items[0])?.id ?? null;
}

export const itemHref = (itemId: string) => `/items/${encodeURIComponent(itemId)}`;
