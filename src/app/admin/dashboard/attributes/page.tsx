"use client";

import { useState } from "react";
import { useAdminAttributes, useCreateAttribute, useDeleteAttribute } from "@/features/attributes/hooks";
import { AttributeForm } from "@/features/attributes/components/AttributeForm";
import { AttributeValuesManager } from "@/features/attributes/components/AttributeValuesManager";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminPageHeader, AdminContent } from "@/components/admin/AdminPageHeader";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormModal } from "@/components/common/FormModal";
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

  // Keep the "manage" modal in sync with fresh values after a mutation.
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
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) =>
        row.original.type === "color" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-50 px-2 py-0.5 text-[11px] font-semibold text-secondary-700 border border-secondary-200">
            Color
          </span>
        ) : (
          <span className="text-xs text-[var(--color-neutral-500)]">Text</span>
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
        description="Define product attributes (e.g. Color, Size, Fabric) and their selectable values."
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
              type: data.type,
              values: data.values ?? [],
            });
            setIsCreateOpen(false);
          }}
        />
      </FormModal>

      {/* Manage Attribute Values */}
      <FormModal
        open={!!liveManageAttribute}
        onClose={() => setManageAttribute(null)}
        title={`Manage "${liveManageAttribute?.name ?? ""}"`}
        description="Manage the selectable values for this attribute"
      >
        {liveManageAttribute && <AttributeValuesManager attribute={liveManageAttribute} />}
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
