"use client";

import { useState } from "react";
import { useAdminAttributes, useCreateAttribute, useDeleteAttribute } from "@/features/attributes/hooks";
import { AttributeForm } from "@/features/attributes/components/AttributeForm";
import { AttributeValuesManager } from "@/features/attributes/components/AttributeValuesManager";
import { AttributeCategoryAssignment } from "@/features/attributes/components/AttributeCategoryAssignment";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminPageHeader, AdminContent } from "@/components/admin/AdminPageHeader";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormModal } from "@/components/common/FormModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { DataTable } from "@/components/admin/data-table/DataTable";
import { SearchInput } from "@/components/ui/search-input";
import { Plus, Settings2, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { AttributeListItem } from "@/features/attributes/types";

export default function AttributesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [manageAttribute, setManageAttribute] = useState<AttributeListItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useAdminAttributes({
    page,
    pageSize,
    search: search || undefined,
  });

  const createMutation = useCreateAttribute();
  const deleteMutation = useDeleteAttribute();

  const attributes = data?.data ?? [];

  // Keep the "manage" modal in sync with fresh values/categories after a mutation.
  const liveManageAttribute = manageAttribute
    ? attributes.find((a) => a.id === manageAttribute.id) ?? manageAttribute
    : null;

  const columns: ColumnDef<AttributeListItem, unknown>[] = [
    {
      accessorKey: "name",
      header: "Attribute",
      cell: ({ row }) => (
        <p className="font-semibold text-[var(--color-neutral-900)]">{row.original.name}</p>
      ),
    },
    {
      accessorKey: "slug",
      header: "Code",
      cell: ({ row }) => (
        <p className="text-sm text-[var(--color-neutral-600)]">{row.original.slug}</p>
      ),
    },
    {
      id: "values",
      header: "Values",
      cell: ({ row }) => (
        <span className="text-[var(--color-neutral-700)]">
          {row.original.values.length} value{row.original.values.length === 1 ? "" : "s"}
        </span>
      ),
    },
    {
      id: "categories",
      header: "Applies To",
      cell: ({ row }) => (
        <span className="text-[var(--color-neutral-700)]">
          {row.original.categoryIds.length} categor
          {row.original.categoryIds.length === 1 ? "y" : "ies"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button variant="ghost" size="icon" onClick={() => setManageAttribute(row.original)}>
            <Settings2 className="h-4 w-4 text-[var(--color-neutral-500)]" />
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
  if (error) return <ErrorState message="Failed to load attributes" onRetry={() => refetch()} />;

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <AdminBreadcrumb items={[{ label: "Catalog" }, { label: "Attributes" }]} />
      <AdminPageHeader
        title="Attribute Management"
        description="Define category-specific product attributes (e.g. Fabric, Dial Color, Bag Type) and the categories they apply to."
      />

      <AdminContent className="flex-1 min-h-0 overflow-hidden">
        <div className="flex h-full flex-col overflow-hidden bg-[var(--color-background)] py-1 rounded-2xl">
          <div className="flex-shrink-0 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SearchInput
              placeholder="Search attributes..."
              defaultValue={search}
              onSearch={(val) => {
                setSearch(val);
                setPage(1);
              }}
              className="w-full max-w-md"
            />

            <Button
              onClick={() => setIsCreateOpen(true)}
              className="h-11 rounded-xl bg-[var(--color-secondary-600)] px-5 text-sm font-semibold text-white hover:bg-[var(--color-secondary-700)]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Attribute
            </Button>
          </div>

          <div className="mt-6 flex-1 min-h-0 overflow-hidden flex flex-col">
            <DataTable
              columns={columns}
              data={attributes}
              pageSize={pageSize}
              pageSizeOptions={[10, 20, 30, 50]}
              page={data?.meta?.page ?? page}
              totalPages={
                data?.meta?.totalPages ??
                Math.max(1, Math.ceil((data?.meta?.total ?? attributes.length) / pageSize))
              }
              totalItems={data?.meta?.total ?? attributes.length}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
              className="bg-white"
            />
          </div>
        </div>
      </AdminContent>

      {/* Add Attribute */}
      <FormModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add Attribute"
        description="Create a new product attribute, optionally with starting values"
      >
        <AttributeForm
          showInitialValues
          isLoading={createMutation.isPending}
          submitLabel="Create Attribute"
          onSubmit={async (data) => {
            await createMutation.mutateAsync({
              name: data.name,
              slug: data.slug,
              values: data.values ?? [],
            });
            setIsCreateOpen(false);
          }}
        />
      </FormModal>

      {/* Manage Attribute: Values + Categories */}
      <FormModal
        open={!!liveManageAttribute}
        onClose={() => setManageAttribute(null)}
        title={`Manage "${liveManageAttribute?.name ?? ""}"`}
        description="Manage the selectable values for this attribute and which categories use it"
      >
        {liveManageAttribute && (
          <Tabs defaultValue="values">
            <TabsList>
              <TabsTrigger value="values">Values</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            <TabsContent value="values">
              <AttributeValuesManager attribute={liveManageAttribute} />
            </TabsContent>
            <TabsContent value="categories">
              <AttributeCategoryAssignment attribute={liveManageAttribute} />
            </TabsContent>
          </Tabs>
        )}
      </FormModal>

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
        title="Delete Attribute"
        description="Are you sure you want to delete this attribute? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
