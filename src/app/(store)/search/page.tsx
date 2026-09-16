"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useCustomerProducts } from "@/features/customers/hooks/use-customer-catalog";
import { formatCurrency } from "@/lib/utils/format-currency";

const SUGGESTIONS_LIMIT = 6;
const DEBOUNCE_MS = 300;

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), DEBOUNCE_MS);

  const { data, isFetching } = useCustomerProducts(
    { search: debouncedQuery, pageSize: SUGGESTIONS_LIMIT },
    { enabled: debouncedQuery.length >= 2 }
  );
  const suggestions = data?.data ?? [];

  const goToResults = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto mt-6">
        <h1 className="text-2xl font-bold text-theme-text-primary mb-4">Search Products</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToResults(query);
          }}
          className="relative"
        >
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-theme-text-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name, brand, or category..."
            autoFocus
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-theme-border bg-theme-surface text-theme-text-primary placeholder:text-theme-text-subtle outline-none focus:border-theme-primary transition-colors"
          />
          {isFetching && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-theme-text-subtle" />
          )}
        </form>

        {debouncedQuery.length >= 2 && (
          <div className="mt-3 rounded-xl border border-theme-border bg-theme-surface overflow-hidden">
            {suggestions.length === 0 && !isFetching ? (
              <p className="p-4 text-sm text-theme-text-subtle text-center">
                No products found for &ldquo;{debouncedQuery}&rdquo;
              </p>
            ) : (
              <>
                {suggestions.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="flex items-center gap-3 p-3 hover:bg-theme-surface-alt transition-colors border-b border-theme-border-subtle last:border-b-0"
                  >
                    <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-theme-surface-alt">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-theme-text-primary truncate">
                        {product.name}
                      </p>
                      {product.category && (
                        <p className="text-xs text-theme-text-subtle truncate">
                          {product.category.name}
                        </p>
                      )}
                    </div>
                    {product.minPrice > 0 && (
                      <p className="text-sm font-bold text-theme-text-primary shrink-0">
                        {formatCurrency(product.minPrice)}
                      </p>
                    )}
                  </Link>
                ))}
                {suggestions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => goToResults(debouncedQuery)}
                    className="w-full p-3 text-sm font-semibold text-theme-primary hover:bg-theme-surface-alt transition-colors text-center cursor-pointer"
                  >
                    View all results for &ldquo;{debouncedQuery}&rdquo;
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
