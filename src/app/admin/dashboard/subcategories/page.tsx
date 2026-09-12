"use client";

import React, { useState, useMemo } from "react";
import { FormModal } from "@/components/common/FormModal";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import Image from "next/image";
import {
  useCategories,
  useDeleteCategory,
  useCreateCategory,
  useUpdateCategory,
} from "@/features/categories/hooks";
import { getImageUrl } from "@/lib/utils";
import { AdminPageHeader, AdminContent } from "@/components/admin/AdminPageHeader";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SearchInput } from "@/components/ui/search-input";
import { DataTable } from "@/components/admin/data-table/DataTable";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { CategoryListItem } from "@/features/categories/types";

export default function AdminSubcategoriesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryListItem | null>(null);

  const { data, isLoading, error, refetch } = useCategories({
    pageSize: 500,
    search: search || undefined,
  });

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const allCategories = data?.success && data.data ? data.data : [];

  const categoryById = useMemo(
    () => new Map(allCategories.map((c) => [String(c.id), c])),
    [allCategories]
  );

  // This page manages every category that has a parent — subcategories at any
  // depth (e.g. Women > Clothing, and Women > Clothing > Dresses). Top-level
  // categories (Women, Men, Beauty, ...) are managed on the separate
  // "Categories" page.
  const subcategories = useMemo(
    () =>
      allCategories
        .filter((c) => !!c.parentId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [allCategories]
  );

  // Any category can be a subcategory's parent (a root, or another subcategory).
  const parentCategoryOptions = allCategories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }));

  // A subcategory's own descendants can't be chosen as its parent (would create a cycle).
  const getDescendantIds = (rootId: string): Set<string> => {
    const byParent = new Map<string, CategoryListItem[]>();
    for (const c of allCategories) {
      const key = c.parentId ? String(c.parentId) : "root";
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key)!.push(c);
    }
    const result = new Set<string>();
    const stack = [rootId];
    while (stack.length) {
      const current = stack.pop()!;
      for (const child of byParent.get(current) ?? []) {
        result.add(String(child.id));
        stack.push(String(child.id));
      }
    }
    return result;
  };

  const excludedIds = selectedCategory
    ? new Set([String(selectedCategory.id), ...getDescendantIds(String(selectedCategory.id))])
    : new Set<string>();

  const editParentOptions = parentCategoryOptions.filter((opt) => !excludedIds.has(opt.value));

  const columns: ColumnDef<CategoryListItem, unknown>[] = [
    {
      id: "image",
      header: "Image",
      cell: ({ row }) => (
        <div className="h-11 w-11 overflow-hidden rounded-lg bg-[var(--color-neutral-100)]">
          <Image
            src={row.original.icon ? getImageUrl(row.original.icon) : "/images/category_img.png"}
            alt={row.original.name}
            width={44}
            height={44}
            className="h-full w-full object-cover"
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Subcategory Name",
      cell: ({ row }) => (
        <p className="font-semibold text-[var(--color-neutral-900)]">{row.original.name}</p>
      ),
    },
    {
      accessorKey: "slug",
      header: "Code",
      cell: ({ row }) => (
        <span className="text-[var(--color-neutral-500)]">{row.original.slug}</span>
      ),
    },
    {
      id: "parent",
      header: "Parent Category",
      cell: ({ row }) => {
        const parent = row.original.parentId
          ? categoryById.get(String(row.original.parentId))
          : null;
        return (
          <span className="inline-flex items-center rounded-full bg-[var(--color-secondary-50)] px-2.5 py-1 text-xs font-semibold text-[var(--color-secondary-700)]">
            {parent?.name ?? "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "sortOrder",
      header: "Sort Order",
      cell: ({ row }) => (
        <span className="text-[var(--color-neutral-700)]">{row.original.sortOrder}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedCategory(row.original);
              setIsEditOpen(true);
            }}
          >
            <Pencil className="h-4 w-4 text-[var(--color-neutral-500)]" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(row.original.id)}>
            <Trash2 className="h-4 w-4 text-[var(--color-error-600)]" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading && !data) {
    return <AdminTableSkeleton />;
  }
  if (error) return <ErrorState message="Failed to load subcategories" onRetry={() => refetch()} />;

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <AdminPageHeader
        title="Subcategories"
        description="Manage subcategories (e.g. Clothing, Dresses) and which category or subcategory each belongs to."
      />
      <AdminContent className="flex-1 min-h-0 overflow-hidden">
        <div className="flex h-full flex-col overflow-hidden bg-[var(--color-background)] py-1 rounded-2xl">
          <div className="flex-shrink-0 mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SearchInput
              placeholder="Search subcategories..."
              defaultValue={search}
              onSearch={(val) => {
                setSearch(val);
                setPage(1);
              }}
              className="w-full max-w-md"
            />

            <Button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="h-11 rounded-xl bg-[var(--color-secondary-600)] px-5 text-sm font-semibold text-white hover:bg-[var(--color-secondary-700)]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Subcategory
            </Button>
          </div>

          <div className="mt-6 flex-1 min-h-0 overflow-hidden flex flex-col">
            <DataTable
              columns={columns}
              data={subcategories}
              pageSize={pageSize}
              pageSizeOptions={[10, 20, 30, 50]}
              page={page}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
              emptyMessage="No subcategories found."
              className="bg-white"
            />
          </div>
        </div>
      </AdminContent>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
        title="Delete Subcategory"
        description="Are you sure you want to delete this subcategory? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />

      <FormModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add Subcategory"
        description="Create a new subcategory under an existing category"
      >
        <CategoryForm
          parentCategories={parentCategoryOptions}
          requireParent
          isLoading={createMutation.isPending}
          submitLabel="Create Subcategory"
          onSubmit={async (data) => {
            if (!data.parentId) {
              return;
            }
            const payload = {
              name: data.name,
              slug: data.slug,
              description: data.description,
              icon: data.image,
              sortOrder: Number(data.sortOrder),
              parentId: data.parentId,
            };

            await createMutation.mutateAsync(payload);

            setIsCreateOpen(false);
            refetch();
          }}
        />
      </FormModal>

      <FormModal
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedCategory(null);
        }}
        title="Update Subcategory"
        description="Update the selected subcategory"
      >
        {selectedCategory && (
          <CategoryForm
            initialData={{
              name: selectedCategory.name,
              slug: selectedCategory.slug,
              description: selectedCategory.description,
              image: selectedCategory.icon,
              isActive: selectedCategory.isActive,
              sortOrder: selectedCategory.sortOrder,
              parentId: selectedCategory.parentId ?? "",
            }}
            isEditing
            parentCategories={editParentOptions}
            requireParent
            isLoading={updateMutation.isPending}
            submitLabel="Update Subcategory"
            onSubmit={async (data) => {
              if (!data.parentId) {
                return;
              }
              const payload = {
                name: data.name,
                slug: data.slug,
                description: data.description,
                icon: data.image,
                sortOrder: Number(data.sortOrder),
                parentId: data.parentId,
              };

              await updateMutation.mutateAsync({
                id: selectedCategory.id,
                data: payload,
              });

              setIsEditOpen(false);
              setSelectedCategory(null);
              refetch();
            }}
          />
        )}
      </FormModal>
    </div>
  );
}
