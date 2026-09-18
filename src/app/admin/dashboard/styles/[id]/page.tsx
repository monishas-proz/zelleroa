"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, Layers } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table/DataTable";
import { AdminPageHeader, AdminContent } from "@/components/admin/AdminPageHeader";
import { AdminDetailSkeleton } from "@/components/admin/AdminDetailSkeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormModal } from "@/components/common/FormModal";
import { useStyleByUuid, useUpdateStyle } from "@/features/styles/hooks";
import { StyleForm, type StyleFormValues } from "@/features/styles/components";
import {
  useItems,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
} from "@/features/items/hooks";
import { ItemForm, type ItemFormValues } from "@/features/items/components";
import type { AdminItemResponse } from "@/features/items/types";
import { toast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/utils";

export default function AdminStyleDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const styleUuid = params?.id ? decodeURIComponent(params.id) : "";

  const { data: styleResponse, isLoading, isError, error, refetch } = useStyleByUuid(
    styleUuid || null
  );
  const style = (styleResponse as any)?.data ?? styleResponse;
  const productUuid: string | null = style?.productId || null;

  const [isEditStyleOpen, setIsEditStyleOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminItemResponse | null>(null);
  const [deletingItem, setDeletingItem] = useState<AdminItemResponse | null>(null);

  const { data: itemsResponse, isLoading: isLoadingItems, refetch: refetchItems } = useItems(
    productUuid,
    styleUuid || null,
    { pageSize: 100 }
  );
  const items = itemsResponse?.data ?? [];

  const updateStyleMutation = useUpdateStyle();
  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();

  const columns: ColumnDef<AdminItemResponse>[] = [
    {
      accessorKey: "name",
      header: "Item Name",
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-neutral-900">{row.original.name}</p>
          <p className="text-xs text-neutral-500 font-mono">{row.original.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: "colorCount",
      header: "Colors",
      cell: ({ row }) => <span>{row.original.colorCount}</span>,
    },
    {
      accessorKey: "sizeCount",
      header: "Sizes",
      cell: ({ row }) => <span>{row.original.sizeCount}</span>,
    },
    {
      accessorKey: "minPrice",
      header: "Price Range",
      cell: ({ row }) =>
        row.original.minPrice !== null && row.original.maxPrice !== null ? (
          <span>
            {row.original.minPrice === row.original.maxPrice
              ? formatPrice(row.original.minPrice)
              : `${formatPrice(row.original.minPrice)}–${formatPrice(row.original.maxPrice)}`}
          </span>
        ) : (
          <span className="text-neutral-400">—</span>
        ),
    },
    {
      accessorKey: "totalStock",
      header: "Stock",
      cell: ({ row }) => <span>{row.original.totalStock}</span>,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
            row.original.isActive ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1.5">
          <Link href={`/admin/dashboard/variants?itemId=${row.original.id}`}>
            <Button variant="ghost" size="icon" title="View Colors & Sizes">
              <Layers className="h-4 w-4 text-neutral-500" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setEditingItem(row.original)} title="Edit Item">
            <Pencil className="h-4 w-4 text-neutral-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeletingItem(row.original)} title="Delete Item">
            <Trash2 className="h-4 w-4 text-[var(--color-error-600)]" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <AdminDetailSkeleton />;
  if (isError || !style) {
    return (
      <ErrorState
        message={(error as any)?.message || "Failed to load style"}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <AdminPageHeader
        title={style.name}
        description={style.shortDescription || "Style details, colors and sizes"}
        actions={
          <Button variant="outline" onClick={() => router.push("/admin/dashboard/styles")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Styles
          </Button>
        }
      />

      <AdminContent className="flex-1 overflow-auto space-y-6">
        {/* Style Information */}
        <section className="bg-white border border-cream-border rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-neutral-900">Style Information</h2>
            <Button variant="outline" size="sm" onClick={() => setIsEditStyleOpen(true)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <dt className="text-xs font-semibold text-neutral-400 uppercase">Product</dt>
              <dd className="text-neutral-800 font-medium">{style.productName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-neutral-400 uppercase">Slug</dt>
              <dd className="text-neutral-800 font-mono">{style.slug}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-neutral-400 uppercase">Status</dt>
              <dd className="text-neutral-800 font-medium">{style.isActive ? "Active" : "Inactive"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-neutral-400 uppercase">Items</dt>
              <dd className="text-neutral-800 font-medium">{items.length}</dd>
            </div>
            {style.description && (
              <div className="sm:col-span-2 lg:col-span-4">
                <dt className="text-xs font-semibold text-neutral-400 uppercase">Description</dt>
                <dd className="text-neutral-700 mt-1">{style.description}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* Items Table */}
        <section className="bg-white border border-cream-border rounded-lg overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-cream-border flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-neutral-900">Items</h2>
            <Button
              onClick={() => setIsAddItemOpen(true)}
              className="h-9 rounded-lg bg-[var(--color-secondary-600)] px-4 text-xs font-semibold text-white hover:bg-[var(--color-secondary-700)]"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Item
            </Button>
          </div>
          <div className="p-2">
            <DataTable
              columns={columns}
              data={items}
              pageSize={100}
              page={1}
              totalPages={1}
              totalItems={items.length}
              onPageChange={() => {}}
              className="bg-white"
            />
          </div>
        </section>
      </AdminContent>

      {/* Edit Style Modal */}
      <FormModal
        open={isEditStyleOpen}
        onClose={() => setIsEditStyleOpen(false)}
        title="Edit Style"
        description={`Update information for ${style.name}`}
        size="lg"
      >
        <StyleForm
          isEditing
          initialData={{
            name: style.name,
            slug: style.slug,
            sku: style.sku || "",
            shortDescription: style.shortDescription || "",
            description: style.description || "",
            cookingRecipe: style.cookingRecipe || "",
            isFeatured: style.isFeatured,
            isDefault: style.isDefault,
            isActive: style.isActive,
          }}
          isLoading={updateStyleMutation.isPending}
          submitLabel="Save Changes"
          onSubmit={async (formData: StyleFormValues) => {
            try {
              await updateStyleMutation.mutateAsync({
                productUuid: style.productId,
                styleUuid: style.id,
                data: {
                  name: formData.name,
                  slug: formData.slug,
                  sku: formData.sku || null,
                  shortDescription: formData.shortDescription || null,
                  description: formData.description || null,
                  ingredients: style.ingredients || null,
                  isReadyToMix: style.isReadyToMix ?? false,
                  cookingRecipe: formData.cookingRecipe || null,
                  shelfLife: style.shelfLife || null,
                  vegType: style.vegType || "na",
                  basePrice: style.basePrice ?? 0,
                  isFeatured: formData.isFeatured,
                  isDefault: formData.isDefault ?? false,
                  isActive: formData.isActive,
                },
              });
              setIsEditStyleOpen(false);
              toast.success("Style updated", `"${formData.name}" was saved.`);
              refetch();
            } catch (err: any) {
              toast.error("Failed to update style", err?.message || "Please try again.");
            }
          }}
        />
      </FormModal>

      {/* Add Item Modal */}
      <FormModal
        open={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        title="Add Item"
        description={`Create a new sub-variant under "${style.name}" (e.g. "Regular Fit", "Slim Fit")`}
        size="lg"
      >
        <ItemForm
          isLoading={createItemMutation.isPending}
          submitLabel="Create Item"
          onSubmit={async (formData: ItemFormValues) => {
            try {
              await createItemMutation.mutateAsync({
                productUuid: productUuid!,
                styleUuid,
                data: {
                  name: formData.name,
                  slug: formData.slug,
                  sku: formData.sku || null,
                  shortDescription: formData.shortDescription || null,
                  description: formData.description || null,
                  basePrice: formData.basePrice ?? 0,
                  isFeatured: formData.isFeatured,
                  isDefault: formData.isDefault ?? false,
                  isActive: formData.isActive,
                },
              });
              setIsAddItemOpen(false);
              toast.success("Item created", `"${formData.name}" is ready for Colors & Sizes.`);
              refetchItems();
            } catch (err: any) {
              toast.error("Failed to create item", err?.message || "Please try again.");
            }
          }}
        />
      </FormModal>

      {/* Edit Item Modal */}
      <FormModal
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        title="Edit Item"
        description={`Update information for ${editingItem?.name || ""}`}
        size="lg"
      >
        {editingItem && (
          <ItemForm
            isEditing
            initialData={{
              name: editingItem.name,
              slug: editingItem.slug,
              sku: editingItem.sku || "",
              shortDescription: editingItem.shortDescription || "",
              description: editingItem.description || "",
              basePrice: editingItem.basePrice ?? 0,
              isFeatured: editingItem.isFeatured,
              isDefault: editingItem.isDefault,
              isActive: editingItem.isActive,
            }}
            isLoading={updateItemMutation.isPending}
            submitLabel="Save Changes"
            onSubmit={async (formData: ItemFormValues) => {
              if (!editingItem) return;
              try {
                await updateItemMutation.mutateAsync({
                  productUuid: productUuid!,
                  styleUuid,
                  itemUuid: editingItem.id,
                  data: {
                    name: formData.name,
                    slug: formData.slug,
                    sku: formData.sku || null,
                    shortDescription: formData.shortDescription || null,
                    description: formData.description || null,
                    basePrice: formData.basePrice ?? 0,
                    isFeatured: formData.isFeatured,
                    isDefault: formData.isDefault ?? false,
                    isActive: formData.isActive,
                  },
                });
                setEditingItem(null);
                toast.success("Item updated", `"${formData.name}" was saved.`);
                refetchItems();
              } catch (err: any) {
                toast.error("Failed to update item", err?.message || "Please try again.");
              }
            }}
          />
        )}
      </FormModal>

      {/* Delete Item Dialog */}
      <ConfirmDialog
        open={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={async () => {
          if (!deletingItem) return;
          const target = deletingItem;
          setDeletingItem(null);
          try {
            await deleteItemMutation.mutateAsync({
              productUuid: productUuid!,
              styleUuid,
              itemUuid: target.id,
            });
            toast.success("Item deleted", `"${target.name}" was removed.`);
            refetchItems();
          } catch (err: any) {
            toast.error("Failed to delete item", err?.message || "Please try again.");
          }
        }}
        title="Delete Item"
        description={`Are you sure you want to delete "${deletingItem?.name}"? Its Colors and Sizes will no longer be manageable. This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteItemMutation.isPending}
      />
    </div>
  );
}
