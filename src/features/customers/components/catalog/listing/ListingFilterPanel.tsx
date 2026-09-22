"use client";

import * as React from "react";
import { Check, ChevronDown, Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import {
  countActiveListingFilters,
  type ListingGender,
  type ListingQuery,
} from "../../../utils/catalog-listing-query";
import type {
  ListingAttributeFilterDto,
  ListingFilterValueDto,
  ListingFiltersDto,
} from "../../../types/catalog-listing.types";

const COLLAPSED_VALUE_LIMIT = 8;

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

function FilterSection({
  title,
  badge,
  defaultOpen = true,
  children,
}: {
  title: string;
  badge?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const id = React.useId();

  return (
    <section className="border-t border-theme-border-subtle pt-4 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-2 text-left cursor-pointer"
      >
        <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-theme-text-secondary">
          {title}
          {badge ? (
            <span className="rounded-full bg-theme-primary px-1.5 py-px text-[10px] font-bold text-theme-primary-fg">
              {badge}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-theme-text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div id={id} className="mt-3">
          {children}
        </div>
      )}
    </section>
  );
}

/** Checkbox (multi-select) or radio (single-select) row with a result count. */
function OptionRow({
  value,
  multiple,
  onToggle,
}: {
  value: ListingFilterValueDto;
  multiple: boolean;
  onToggle: () => void;
}) {
  const disabled = value.count === 0 && !value.selected;
  return (
    <button
      type="button"
      role={multiple ? "checkbox" : "radio"}
      aria-checked={value.selected}
      disabled={disabled}
      onClick={onToggle}
      className={`group flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left text-sm transition-colors ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer hover:bg-theme-surface-alt"
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
          multiple ? "rounded" : "rounded-full"
        } ${
          value.selected
            ? "border-theme-primary bg-theme-primary text-theme-primary-fg"
            : "border-theme-border-input bg-theme-surface group-hover:border-theme-primary"
        }`}
      >
        {value.selected &&
          (multiple ? (
            <Check className="h-3 w-3 stroke-[3]" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
          ))}
      </span>
      <span
        className={`flex-1 truncate ${
          value.selected ? "font-semibold text-theme-text-primary" : "text-theme-text-subtle"
        }`}
      >
        {value.label}
      </span>
      <span className="text-xs tabular-nums text-theme-text-muted">{value.count}</span>
    </button>
  );
}

function SwatchOption({ value, onToggle }: { value: ListingFilterValueDto; onToggle: () => void }) {
  const disabled = value.count === 0 && !value.selected;
  return (
    <button
      type="button"
      aria-pressed={value.selected}
      disabled={disabled}
      onClick={onToggle}
      title={`${value.label} (${value.count})`}
      className={`flex flex-col items-center gap-1 rounded-lg p-1 text-center transition-colors ${
        disabled ? "cursor-not-allowed opacity-35" : "cursor-pointer hover:bg-theme-surface-alt"
      }`}
    >
      <span
        className={`relative flex h-8 w-8 items-center justify-center rounded-full border ${
          value.selected
            ? "border-theme-primary ring-2 ring-theme-primary ring-offset-2 ring-offset-theme-surface"
            : "border-theme-border-input"
        }`}
        style={{ backgroundColor: value.colorHex ?? "var(--theme-surface-alt)" }}
      >
        {value.selected && (
          <Check className="h-3.5 w-3.5 stroke-[3] text-white mix-blend-difference" />
        )}
      </span>
      <span
        className={`w-full truncate text-[11px] ${
          value.selected ? "font-bold text-theme-text-primary" : "text-theme-text-subtle"
        }`}
      >
        {value.label}
      </span>
    </button>
  );
}

function ChipOption({
  value,
  multiple,
  onToggle,
}: {
  value: ListingFilterValueDto;
  multiple: boolean;
  onToggle: () => void;
}) {
  const disabled = value.count === 0 && !value.selected;
  return (
    <button
      type="button"
      role={multiple ? "checkbox" : "radio"}
      aria-checked={value.selected}
      disabled={disabled}
      onClick={onToggle}
      title={`${value.label} (${value.count})`}
      className={`min-w-11 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors ${
        value.selected
          ? "border-theme-primary bg-theme-primary text-theme-primary-fg"
          : disabled
            ? "cursor-not-allowed border-theme-border-subtle text-theme-text-muted line-through opacity-50"
            : "cursor-pointer border-theme-border-input bg-theme-surface text-theme-text-secondary hover:border-theme-primary"
      }`}
    >
      {value.label}
    </button>
  );
}

function AttributeFilter({
  attribute,
  onToggle,
}: {
  attribute: ListingAttributeFilterDto;
  onToggle: (value: ListingFilterValueDto) => void;
}) {
  const [showAll, setShowAll] = React.useState(false);
  const selectedCount = attribute.values.filter((v) => v.selected).length;

  // Short labels (S/M/L, 7/8/9) read best as a chip grid; anything longer as a list.
  const asChips = attribute.type !== "color" && attribute.values.every((v) => v.label.length <= 5);
  const limit = attribute.type === "color" || asChips ? COLLAPSED_VALUE_LIMIT * 2 : COLLAPSED_VALUE_LIMIT;
  const collapsible = attribute.values.length > limit;
  const visible =
    collapsible && !showAll
      ? attribute.values.filter((v, i) => i < limit || v.selected)
      : attribute.values;

  return (
    <FilterSection title={attribute.name} badge={selectedCount}>
      {!attribute.multiple && (
        <p className="mb-2 text-[11px] text-theme-text-muted">Choose one</p>
      )}
      {attribute.type === "color" ? (
        <div className="grid grid-cols-4 gap-1" role="group" aria-label={attribute.name}>
          {visible.map((value) => (
            <SwatchOption key={value.key} value={value} onToggle={() => onToggle(value)} />
          ))}
        </div>
      ) : asChips ? (
        <div
          className="flex flex-wrap gap-2"
          role={attribute.multiple ? "group" : "radiogroup"}
          aria-label={attribute.name}
        >
          {visible.map((value) => (
            <ChipOption
              key={value.key}
              value={value}
              multiple={attribute.multiple}
              onToggle={() => onToggle(value)}
            />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col"
          role={attribute.multiple ? "group" : "radiogroup"}
          aria-label={attribute.name}
        >
          {visible.map((value) => (
            <OptionRow
              key={value.key}
              value={value}
              multiple={attribute.multiple}
              onToggle={() => onToggle(value)}
            />
          ))}
        </div>
      )}
      {collapsible && (
        <button
          type="button"
          onClick={() => setShowAll((s) => !s)}
          className="mt-2 text-xs font-bold text-theme-primary hover:underline cursor-pointer"
        >
          {showAll ? "Show less" : `Show all ${attribute.values.length}`}
        </button>
      )}
    </FilterSection>
  );
}

function PriceRangeFilter({
  bounds,
  minPrice,
  maxPrice,
  onCommit,
}: {
  bounds: { min: number; max: number };
  minPrice: number | null;
  maxPrice: number | null;
  onCommit: (min: number | null, max: number | null) => void;
}) {
  const span = bounds.max - bounds.min;
  const step = span <= 1000 ? 10 : span <= 10000 ? 50 : 100;
  const clamp = (v: number) => Math.min(bounds.max, Math.max(bounds.min, v));

  const committedLow = clamp(minPrice ?? bounds.min);
  const committedHigh = clamp(maxPrice ?? bounds.max);
  const [low, setLow] = React.useState(committedLow);
  const [high, setHigh] = React.useState(committedHigh);

  // Follow external changes (Clear all, chip removal, back/forward).
  const [synced, setSynced] = React.useState({ low: committedLow, high: committedHigh });
  if (synced.low !== committedLow || synced.high !== committedHigh) {
    setSynced({ low: committedLow, high: committedHigh });
    setLow(committedLow);
    setHigh(committedHigh);
  }

  // Dragging commits once the thumb settles, not on every step.
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const commit = (lo: number, hi: number, delay: number) => {
    if (timer.current) clearTimeout(timer.current);
    const run = () =>
      onCommit(lo <= bounds.min ? null : lo, hi >= bounds.max ? null : hi);
    if (delay === 0) run();
    else timer.current = setTimeout(run, delay);
  };

  /** Typed values commit on blur/Enter, so typing "500" isn't clamped at "5". */
  const commitTyped = (raw: string, which: "low" | "high") => {
    const parsed = Number(raw);
    if (raw.trim() === "" || !Number.isFinite(parsed)) return;
    const value = clamp(Math.round(parsed));
    const lo = which === "low" ? Math.min(value, high) : low;
    const hi = which === "high" ? Math.max(value, low) : high;
    if (lo === committedLow && hi === committedHigh) return;
    setLow(lo);
    setHigh(hi);
    commit(lo, hi, 0);
  };

  const pct = (v: number) => (span > 0 ? ((v - bounds.min) / span) * 100 : 0);
  const thumb =
    "absolute inset-x-0 top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none " +
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4.5 [&::-webkit-slider-thumb]:w-4.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-theme-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer " +
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-theme-primary [&::-moz-range-thumb]:cursor-pointer";

  const numberInput =
    "w-full rounded-lg border border-theme-border-input bg-theme-surface px-2.5 py-1.5 text-sm text-theme-text-primary focus:border-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary";

  return (
    <FilterSection title="Price" badge={minPrice !== null || maxPrice !== null ? 1 : 0}>
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-theme-border" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-theme-primary"
          style={{ left: `${pct(Math.min(low, high))}%`, width: `${Math.abs(pct(high) - pct(low))}%` }}
        />
        <input
          type="range"
          aria-label="Minimum price"
          min={bounds.min}
          max={bounds.max}
          step={step}
          value={low}
          onChange={(e) => {
            const lo = Math.min(Number(e.target.value), high);
            setLow(lo);
            commit(lo, high, 450);
          }}
          className={thumb}
        />
        <input
          type="range"
          aria-label="Maximum price"
          min={bounds.min}
          max={bounds.max}
          step={step}
          value={high}
          onChange={(e) => {
            const hi = Math.max(Number(e.target.value), low);
            setHigh(hi);
            commit(low, hi, 450);
          }}
          className={thumb}
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        {(["low", "high"] as const).map((which, i) => (
          <React.Fragment key={which}>
            {i === 1 && <span className="text-theme-text-muted">–</span>}
            <label className="flex-1">
              <span className="sr-only">{which === "low" ? "Minimum price" : "Maximum price"}</span>
              <input
                // Re-seeded whenever the slider moves; free-typed otherwise.
                key={`${which}-${which === "low" ? low : high}`}
                type="number"
                inputMode="numeric"
                min={bounds.min}
                max={bounds.max}
                defaultValue={which === "low" ? low : high}
                onBlur={(e) => commitTyped(e.target.value, which)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitTyped(e.currentTarget.value, which);
                }}
                className={numberInput}
              />
            </label>
          </React.Fragment>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-theme-text-muted">
        {formatPrice(bounds.min)} – {formatPrice(bounds.max)} in this category
      </p>
    </FilterSection>
  );
}

function SearchFilter({
  value,
  placeholder,
  onCommit,
}: {
  value: string;
  placeholder: string;
  onCommit: (search: string) => void;
}) {
  const [local, setLocal] = React.useState(value);

  // Follow external changes (chip removal, Clear all, back/forward).
  const [synced, setSynced] = React.useState(value);
  if (synced !== value) {
    setSynced(value);
    setLocal(value);
  }

  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const onType = (next: string) => {
    setLocal(next);
    if (timer.current) clearTimeout(timer.current);
    if (next.trim() === value) return;
    timer.current = setTimeout(() => onCommit(next.trim()), 400);
  };

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-text-muted" />
      <input
        type="search"
        value={local}
        onChange={(e) => onType(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-xl border border-theme-border-input bg-theme-surface py-2.5 pl-9 pr-9 text-sm text-theme-text-primary placeholder:text-theme-text-muted focus:border-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary [&::-webkit-search-cancel-button]:hidden"
      />
      {local && (
        <button
          type="button"
          onClick={() => {
            if (timer.current) clearTimeout(timer.current);
            setLocal("");
            onCommit("");
          }}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-theme-text-muted hover:text-theme-text-primary cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

export interface ListingFilterPanelProps {
  filters: ListingFiltersDto | undefined;
  query: ListingQuery;
  onChange: (next: ListingQuery) => void;
  onClearAll: () => void;
  isLoading: boolean;
  isFetching: boolean;
  totalResults: number | undefined;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  searchPlaceholder: string;
}

function toggleIn<T>(list: T[], value: T, equals: (a: T, b: T) => boolean = Object.is): T[] {
  return list.some((v) => equals(v, value)) ? list.filter((v) => !equals(v, value)) : [...list, value];
}

const sameLabel = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

export function ListingFilterPanel({
  filters,
  query,
  onChange,
  onClearAll,
  isLoading,
  isFetching,
  totalResults,
  isMobileOpen,
  onCloseMobile,
  searchPlaceholder,
}: ListingFilterPanelProps) {
  const activeCount = countActiveListingFilters(query);

  const toggleAttribute = (attribute: ListingAttributeFilterDto, value: ListingFilterValueDto) => {
    const current = query.attributes[attribute.key] ?? [];
    const next = attribute.multiple
      ? toggleIn(current, value.key, sameLabel)
      : current.some((v) => sameLabel(v, value.key))
        ? []
        : [value.key];
    const attributes = { ...query.attributes };
    if (next.length > 0) attributes[attribute.key] = next;
    else delete attributes[attribute.key];
    onChange({ ...query, attributes });
  };

  // Lock page scroll behind the mobile drawer; Escape closes it.
  React.useEffect(() => {
    if (!isMobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseMobile();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isMobileOpen, onCloseMobile]);

  const hasAnyFilter =
    filters &&
    (filters.priceRange ||
      filters.availability ||
      filters.attributes.length > 0 ||
      filters.brands.length > 0 ||
      filters.genders.length > 0);

  const sections = (
    <div className="flex flex-col gap-4">
      <SearchFilter
        value={query.search}
        placeholder={searchPlaceholder}
        onCommit={(search) => onChange({ ...query, search })}
      />

      {isLoading && !filters ? (
        <div className="flex flex-col gap-4 pt-2" aria-hidden>
          {[1, 2, 3].map((n) => (
            <div key={n} className="space-y-2.5">
              <div className="h-3 w-20 rounded skeleton-shimmer" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((m) => (
                  <div key={m} className="h-7 w-11 rounded-lg skeleton-shimmer" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        filters && (
          <>
            {filters.priceRange && (
              <PriceRangeFilter
                bounds={filters.priceRange}
                minPrice={query.minPrice}
                maxPrice={query.maxPrice}
                onCommit={(minPrice, maxPrice) => onChange({ ...query, minPrice, maxPrice })}
              />
            )}

            {filters.attributes.map((attribute) => (
              <AttributeFilter
                key={attribute.key}
                attribute={attribute}
                onToggle={(value) => toggleAttribute(attribute, value)}
              />
            ))}

            {filters.brands.length > 0 && (
              <FilterSection title="Brand" badge={query.brands.length}>
                <div className="flex flex-col" role="group" aria-label="Brand">
                  {filters.brands.map((brand) => (
                    <OptionRow
                      key={brand.key}
                      value={brand}
                      multiple
                      onToggle={() =>
                        onChange({ ...query, brands: toggleIn(query.brands, brand.key) })
                      }
                    />
                  ))}
                </div>
              </FilterSection>
            )}

            {filters.genders.length > 0 && (
              <FilterSection title="Shop For" badge={query.genders.length}>
                <div className="flex flex-col" role="group" aria-label="Shop for">
                  {filters.genders.map((gender) => (
                    <OptionRow
                      key={gender.key}
                      value={gender}
                      multiple
                      onToggle={() =>
                        onChange({
                          ...query,
                          genders: toggleIn<ListingGender>(query.genders, gender.key),
                        })
                      }
                    />
                  ))}
                </div>
              </FilterSection>
            )}

            {filters.availability && (
              <FilterSection title="Availability" badge={query.inStockOnly ? 1 : 0}>
                <OptionRow
                  value={{
                    key: "in-stock",
                    label: "In stock only",
                    colorHex: null,
                    count: filters.availability.inStockCount,
                    selected: query.inStockOnly,
                  }}
                  multiple
                  onToggle={() => onChange({ ...query, inStockOnly: !query.inStockOnly })}
                />
              </FilterSection>
            )}

            {!hasAnyFilter && (
              <p className="text-xs text-theme-text-muted">
                No further filters apply to the products in this category.
              </p>
            )}
          </>
        )
      )}
    </div>
  );

  const header = (
    <div className="flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-2 text-sm font-extrabold text-theme-text-primary">
        <SlidersHorizontal className="h-4 w-4 text-theme-primary" />
        Filters
        {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin text-theme-text-muted" />}
      </h2>
      {activeCount > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-bold text-theme-primary hover:underline cursor-pointer"
        >
          Clear all ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      <aside
        aria-label="Product filters"
        className="hidden lg:block w-68 xl:w-72 shrink-0 self-start sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-theme-border bg-theme-surface p-5 shadow-2xs"
      >
        <div className="mb-4 border-b border-theme-border-subtle pb-3">{header}</div>
        {sections}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-black/50" onClick={onCloseMobile} />
          <div className="relative z-10 flex h-full w-full max-w-sm flex-col bg-theme-surface shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center gap-2 border-b border-theme-border-subtle px-4 py-3.5">
              <div className="flex-1">{header}</div>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close filters"
                className="rounded-lg p-1.5 text-theme-text-muted hover:bg-theme-surface-alt hover:text-theme-text-primary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">{sections}</div>
            <div className="border-t border-theme-border-subtle p-4">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full rounded-xl bg-theme-primary py-3 text-sm font-extrabold text-theme-primary-fg hover:bg-theme-primary-hover cursor-pointer"
              >
                {totalResults === undefined
                  ? "Show products"
                  : `Show ${totalResults} product${totalResults === 1 ? "" : "s"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ListingFilterPanel;
