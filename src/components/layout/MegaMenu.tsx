"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CategoryTreeNode } from "@/features/categories/types";
import { categoryHref } from "@/features/customers/utils/catalog-listing-query";
import { itemHref } from "@/features/customers/utils/style-default-item";
import { useCategoryMenu } from "@/features/customers/hooks/use-customer-catalog";
import { ProductImage } from "@/components/common/ProductImage";

interface MegaMenuProps {
  root: CategoryTreeNode;
  isActive?: boolean;
}

/**
 * One top-level nav item (e.g. "Women"). Hovering/focusing opens a dropdown:
 * the subcategories on the left (one column per level-2 child with its
 * level-3 links, or a single list when there is no level-3), and on the right
 * the Products under the category, each listing its Items.
 */
export function MegaMenu({ root, isActive }: MegaMenuProps) {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const href = categoryHref(root);
  const hasChildren = root.children.length > 0;
  const hasGrandchildren = root.children.some((c) => c.children.length > 0);

  const { data: menu, isLoading } = useCategoryMenu(root.slug || root.id, { enabled: open });
  const products = menu?.products ?? [];
  const showProducts = isLoading || products.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => {
        cancelClose();
        setOpen(true);
      }}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <Link
        href={href}
        className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-theme-primary text-theme-primary-fg font-semibold"
            : "text-hover-primary hover:text-theme-primary"
        }`}
      >
        {root.name}
      </Link>

      {open && (hasChildren || showProducts) && (
        <div
          className="absolute left-1/2 top-full z-50 mt-3 flex max-w-[min(1100px,calc(100vw-2rem))] w-max -translate-x-1/2 gap-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-xl"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {hasChildren && (
            <div className="shrink-0">
              {hasGrandchildren ? (
                <div className="flex gap-8">
                  {root.children.map((level2) => (
                    <div key={level2.id} className="min-w-[160px]">
                      <Link
                        href={categoryHref(level2)}
                        onClick={() => setOpen(false)}
                        className="mb-3 block text-xs font-bold uppercase tracking-wide text-neutral-900 hover:text-theme-primary"
                      >
                        {level2.name}
                      </Link>
                      <ul className="space-y-2">
                        {level2.children.map((level3) => (
                          <li key={level3.id}>
                            <Link
                              href={categoryHref(level3)}
                              onClick={() => setOpen(false)}
                              className="text-sm text-neutral-600 hover:text-theme-primary"
                            >
                              {level3.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-neutral-900">
                    Categories
                  </p>
                  <ul className="space-y-2">
                    {root.children.map((level2) => (
                      <li key={level2.id}>
                        <Link
                          href={categoryHref(level2)}
                          onClick={() => setOpen(false)}
                          className="text-sm text-neutral-700 hover:text-theme-primary whitespace-nowrap"
                        >
                          {level2.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {showProducts && (
            <div className={`min-w-0 ${hasChildren ? "border-l border-neutral-100 pl-8" : ""}`}>
              <div className="mb-3 flex items-center justify-between gap-6">
                <p className="text-xs font-bold uppercase tracking-wide text-neutral-900">
                  Products
                </p>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-0.5 text-xs font-semibold text-theme-primary hover:underline"
                >
                  View all
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="w-44 space-y-2 animate-pulse">
                      <div className="h-3 w-24 rounded bg-neutral-200" />
                      {[1, 2, 3].map((m) => (
                        <div key={m} className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-md bg-neutral-100" />
                          <div className="h-3 w-24 rounded bg-neutral-100" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-x-6 gap-y-5">
                  {products.map((product) => (
                    <div key={product.id} className="w-44">
                      {product.items[0] ? (
                        <Link
                          href={itemHref(product.items[0].id)}
                          onClick={() => setOpen(false)}
                          className="mb-2 block truncate text-sm font-semibold text-neutral-900 hover:text-theme-primary"
                          title={product.name}
                        >
                          {product.name}
                        </Link>
                      ) : (
                        <p className="mb-2 truncate text-sm font-semibold text-neutral-900">
                          {product.name}
                        </p>
                      )}
                      <ul className="space-y-1.5">
                        {product.items.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={itemHref(item.id)}
                              onClick={() => setOpen(false)}
                              className="group flex items-center gap-2 rounded-md p-1 -m-1 hover:bg-neutral-50"
                            >
                              <ProductImage
                                src={item.image}
                                alt={item.name}
                                sizes="40px"
                                fallbackSize="compact"
                                containerClassName="h-10 !w-10 shrink-0 rounded-md"
                                className="object-cover"
                              />
                              <span className="truncate text-sm text-neutral-600 group-hover:text-theme-primary">
                                {item.name}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MegaMenu;
