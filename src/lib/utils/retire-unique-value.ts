/**
 * Slug, SKU and code columns carry a global UNIQUE index that knows nothing
 * about soft deletes, so an archived row keeps reserving its own value forever:
 * the service-level duplicate check passes (it filters out deleted rows) and the
 * insert then dies on a P2002 instead.
 *
 * Namespacing the value when the row is archived frees it for reuse while
 * leaving the original readable on the archived row. The id keeps the result
 * unique, and the base is trimmed so the whole thing still fits the column.
 *
 * Short columns (e.g. product_units.code is VarChar(10)) can't hold the readable
 * suffix, so they fall back to a bare `~<id>` marker. `~` never appears in a
 * generated slug or SKU, so it can't collide with a live value.
 */
export function retireUniqueValue(
  value: string,
  id: bigint | number,
  maxLength: number
): string {
  const suffix = `-deleted-${id}`;
  if (suffix.length >= maxLength) return `~${id}`;
  return `${value.slice(0, maxLength - suffix.length)}${suffix}`;
}
