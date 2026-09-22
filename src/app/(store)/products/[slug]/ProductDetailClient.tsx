"use client";

import { StyleDetailClient } from "../../styles/[slug]/StyleDetailClient";

/**
 * `slug` is the Style UUID older cards link to. The Style's Items are never
 * offered as a choice on one page - this resolves to the default Item's own
 * page (`/items/:id`), exactly as `/styles/:id` does.
 */
export function ProductDetailClient({ slug }: { slug: string }) {
  return <StyleDetailClient slug={slug} notFoundMessage="Product not found" />;
}
