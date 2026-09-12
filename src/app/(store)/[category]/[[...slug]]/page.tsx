"use client";

import { use, useMemo, useState } from "react";
import { useCategoryTree } from "@/features/categories/hooks";
import { useCustomerGlobalVariants } from "@/features/customers/hooks/use-customer-catalog";
import { CustomerProductGrid } from "@/features/customers/components/catalog/CustomerProductGrid";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Loader2 } from "lucide-react";
import type { CategoryTreeNode } from "@/features/categories/types";

interface CategoryPageProps {
  params: Promise<{ category: string; slug?: string[] }>;
}

function findPath(nodes: CategoryTreeNode[], slugs: string[]): CategoryTreeNode[] | null {
  if (slugs.length === 0) return [];
  const [head, ...rest] = slugs;
  const match = nodes.find((n) => n.slug === head);
  if (!match) return null;
  const remainder = findPath(match.children, rest);
  if (remainder === null) return null;
  return [match, ...remainder];
}

function collectDescendantIds(node: CategoryTreeNode): string[] {
  return [node.id, ...node.children.flatMap(collectDescendantIds)];
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <div key={n} className="space-y-3">
          <div className="aspect-square w-full rounded-xl bg-neutral-100 animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-neutral-100 animate-pulse" />
          <div className="h-3 w-1/3 rounded bg-neutral-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function CategoryTreePage({ params }: CategoryPageProps) {
  const { category, slug = [] } = use(params);

  const [page, setPage] = useState(1);
  const { data: tree = [], isLoading: isTreeLoading } = useCategoryTree();

  const fullSlugPath = useMemo(() => [category, ...slug], [category, slug]);
  const chain = useMemo(() => findPath(tree, fullSlugPath), [tree, fullSlugPath]);
  const resolved = chain && chain.length > 0 ? chain[chain.length - 1] : null;
  const categoryIds = useMemo(
    () => (resolved ? collectDescendantIds(resolved) : []),
    [resolved]
  );

  const {
    data: variantsResponse,
    isLoading: isVariantsLoading,
    isFetching,
  } = useCustomerGlobalVariants(
    {
      page,
      pageSize: 24,
      categoryIds,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    { enabled: !!resolved }
  );

  const variants = variantsResponse?.data ?? [];
  const meta = variantsResponse?.meta;

  if (isTreeLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!chain) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Category not found</h1>
        <p className="mt-2 text-neutral-500">
          The category you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
      </div>
    );
  }

  const breadcrumbItems = chain.map((node, idx) => ({
    label: node.name,
    href: idx < chain.length - 1 ? `/${fullSlugPath.slice(0, idx + 1).join("/")}` : undefined,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumb items={breadcrumbItems} className="mb-4" />

      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">
        {resolved?.name}
      </h1>
      <p className="text-sm text-neutral-500 mb-6">
        {meta?.total ?? 0} product{meta?.total === 1 ? "" : "s"}
      </p>

      {isVariantsLoading ? (
        <ProductGridSkeleton />
      ) : (
        <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <CustomerProductGrid variants={variants} columns={4} />

          {meta && meta.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-neutral-500">
                Page {page} of {meta.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
