"use client";

import * as React from "react";
import Link from "next/link";
import type { CategoryTreeNode } from "@/features/categories/types";

interface MegaMenuProps {
  root: CategoryTreeNode;
  path: string[]; // slug path down to (and including) `root`
  isActive?: boolean;
}

/**
 * One top-level nav item (e.g. "Women"). Hovering/focusing opens a dropdown:
 * one column per level-2 child, each listing its level-3 children as links.
 * Falls back to a single-column list when the category has no depth beyond
 * level-2 (e.g. Beauty, Kids), or plain link when it has no children at all.
 */
export function MegaMenu({ root, path, isActive }: MegaMenuProps) {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const href = `/${path.join("/")}`;
  const hasChildren = root.children.length > 0;
  const hasGrandchildren = root.children.some((c) => c.children.length > 0);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
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

      {open && hasChildren && (
        <div
          className="absolute left-1/2 top-full z-50 mt-3 w-max -translate-x-1/2 rounded-xl border border-neutral-200 bg-white p-6 shadow-xl"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {hasGrandchildren ? (
            <div className="flex gap-8">
              {root.children.map((level2) => (
                <div key={level2.id} className="min-w-[160px]">
                  <Link
                    href={`/${[...path, level2.slug].join("/")}`}
                    className="mb-3 block text-xs font-bold uppercase tracking-wide text-neutral-900 hover:text-theme-primary"
                  >
                    {level2.name}
                  </Link>
                  <ul className="space-y-2">
                    {level2.children.map((level3) => (
                      <li key={level3.id}>
                        <Link
                          href={`/${[...path, level2.slug, level3.slug].join("/")}`}
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
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
              {root.children.map((level2) => (
                <li key={level2.id}>
                  <Link
                    href={`/${[...path, level2.slug].join("/")}`}
                    className="text-sm text-neutral-700 hover:text-theme-primary whitespace-nowrap"
                  >
                    {level2.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default MegaMenu;
