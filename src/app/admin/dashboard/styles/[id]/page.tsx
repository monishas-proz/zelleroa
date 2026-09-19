"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, Layers, Sparkles, IndianRupee } from "lucide-react";
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
import {
  ItemForm,
  ItemAttributesPanel,
  ItemVariantDetails,
  type ItemFormValues,
} from "@/features/items/components";
import type { AdminItemResponse } from "@/features/items/types";
import { useConfiguredAttributesForProduct } from "@/features/attributes/hooks";
import {
  useVariants,
  useCreateVariant,
  useUpdateVariant,
  useDeleteVariant,
  useVariantUnitPrices,
} from "@/features/variants/hooks";
import {
  VariantForm,
  VariantCard,
  VariantUnitPriceList,
  VariantImageUploader,
  VariantGenerator,
  type VariantFormValues,
} from "@/features/variants/components";
import { ProductPriceEditModal } from "@/features/products/components/ProductPriceEditModal";
import type { AdminVariantResponse } from "@/features/variants/types";
import { toast } from "@/components/ui/Toast";

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
  const [newlyCreatedItem, setNewlyCreatedItem] = useState<AdminItemResponse | null>(null);
  const [editingItem, setEditingItem] = useState<AdminItemResponse | null>(null);
  const [deletingItem, setDeletingItem] = useState<AdminItemResponse | null>(null);
  const [attributesItem, setAttributesItem] = useState<AdminItemResponse | null>(null);

  // Colors & Sizes management, inline on this page - opened per Item instead
  // of sending the admin off to the separate /variants list.
  const [manageColorsItem, setManageColorsItem] = useState<AdminItemResponse | null>(null);
  const [isAddVariantOpen, setIsAddVariantOpen] = useState(false);
  const [isBulkGenerateOpen, setIsBulkGenerateOpen] = useState(false);
  const [isBulkEditPricesOpen, setIsBulkEditPricesOpen] = useState(false);
  const [newlyCreatedVariant, setNewlyCreatedVariant] = useState<AdminVariantResponse | null>(null);
  const [editingVariant, setEditingVariant] = useState<AdminVariantResponse | null>(null);
  const [deletingVariant, setDeletingVariant] = useState<AdminVariantResponse | null>(null);
  const [managingImagesVariant, setManagingImagesVariant] = useState<AdminVariantResponse | null>(null);

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

  // All the Product's variants, filtered client-side to whichever Item is
  // being managed - same pattern the Product detail page uses.
  const {
    data: productVariantsResponse,
    refetch: refetchProductVariants,
  } = useVariants(
    productUuid ? { productIds: [productUuid], pageSize: 100 } : undefined,
    { enabled: !!productUuid }
  );
  const itemVariants: AdminVariantResponse[] = (productVariantsResponse?.data ?? []).filter((variant) =>
    items.some((item) => item.id === variant.itemId)
  );
  const manageColorsVariants: AdminVariantResponse[] = manageColorsItem
    ? (productVariantsResponse?.data ?? []).filter((v) => v.itemId === manageColorsItem.id)
    : [];

  const createVariantMutation = useCreateVariant();
  const updateVariantMutation = useUpdateVariant();
  const deleteVariantMutation = useDeleteVariant();

  const { data: newlyCreatedPrices = [] } = useVariantUnitPrices(
    productUuid || null,
    newlyCreatedVariant?.id || null
  );
  const hasNewlyCreatedPrices = newlyCreatedPrices.length > 0;

  // Column headings follow whatever the Product's own attributes are named
  // (e.g. "Colour" instead of a hardcoded "Colors") instead of assuming
  // every product speaks English the same way - falls back to the generic
  // label only when the product has no attributes configured yet.
  const { data: configuredAttributes = [] } = useConfiguredAttributesForProduct(
    productUuid || null
  );
  const colorColumnLabel =
    configuredAttributes.find((a) => a.type === "color")?.name || "Variant";
  const sizeColumnLabel =
    configuredAttributes.find((a) => a.type !== "color" && /size/i.test(a.name))?.name ||
    "Sizes";

  /* const columns: ColumnDef<AdminItemResponse>[] = [
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
      id: "selectedAttributes",
      header: "Attributes",
      cell: ({ row }) => {
        const groups = row.original.selectedAttributes ?? [];
        if (groups.length === 0) {
          return <span className="text-neutral-400">—</span>;
        }
        return (
          <div className="space-y-1.5">
            {groups.map((group) => (
              <div key={group.id} className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-neutral-500 w-16 shrink-0 uppercase">
                  {group.name}
                </span>
                <div className="flex flex-wrap gap-1">
                  {group.values.map((value) => (
                    <span
                      key={value.id}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary-50 text-secondary-700 border border-secondary-200 px-2 py-0.5 text-[11px] font-semibold"
                    >
                      {group.type === "color" &&
                        (value.imageUrl ? (
                          <img
                            src={value.imageUrl}
                            alt=""
                            className="h-3 w-3 rounded-full border border-white/60 object-cover"
                          />
                        ) : (
                          value.colorHex && (
                            <span
                              className="h-3 w-3 rounded-full border border-white/60"
                              style={{ backgroundColor: value.colorHex }}
                            />
                          )
                        ))}
                      {value.value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      },
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setManageColorsItem(row.original)}
            title="Manage Colors & Sizes"
          >
            <Layers className="h-4 w-4 text-neutral-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAttributesItem(row.original)}
            title="Edit Attribute Values"
          >
            <Tags className="h-4 w-4 text-neutral-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setEditingItem(row.original)} title="Edit Item">
            <Pencil className="h-4 w-4 text-neutral-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeletingItem(row.original)} title="Delete Item">
            <Trash2 className="h-4 w-4 text-[var(--color-error-600)]" />
          </Button>
        </div>
      ),
    },
  ]; */

  if (isLoading) return <AdminDetailSkeleton />;
  if (isError || !style) {
    return (
      <ErrorState
        message={(error as any)?.message || "Failed to load item"}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <AdminPageHeader
        title={style.name}
        description={style.shortDescription || "Item details, colors and sizes"}
        actions={
          <Button variant="outline" onClick={() => router.push("/admin/dashboard/styles")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Items
          </Button>
        }
      />

      <AdminContent className="flex-1 overflow-auto space-y-6">
        {/* Item Information */}
        <section className="bg-white border border-cream-border rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-neutral-900">Item Information</h2>
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
              <dt className="text-xs font-semibold text-neutral-400 uppercase">Item Name</dt>
              <dd className="text-neutral-800 font-medium">{style.name}</dd>
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
              <dt className="text-xs font-semibold text-neutral-400 uppercase">Total Variants</dt>
              <dd className="text-neutral-800 font-medium">{itemVariants.flatMap((variant) => variant.unitPrices ?? []).length}</dd>
            </div>
            {style.description && (
              <div className="sm:col-span-2 lg:col-span-4">
                <dt className="text-xs font-semibold text-neutral-400 uppercase">Description</dt>
                <dd className="text-neutral-700 mt-1">{style.description}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* Variant Details */}
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button
              onClick={() => setIsAddItemOpen(true)}
              className="h-9 rounded-lg bg-[var(--color-secondary-600)] px-4 text-xs font-semibold text-white hover:bg-[var(--color-secondary-700)]"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Item
            </Button>
          </div>
          {productUuid && (
            <ItemVariantDetails
              productUuid={productUuid}
              categoryUuid={style.categoryId}
              items={items}
              variants={itemVariants}
              colorLabel={colorColumnLabel}
              sizeLabel={sizeColumnLabel}
              onEditItem={setEditingItem}
              onEditAttributes={setAttributesItem}
              onDeleteItem={setDeletingItem}
              onAddVariant={(item) => {
                setManageColorsItem(item);
                setIsAddVariantOpen(true);
              }}
            />
          )}
        </div>
      </AdminContent>

      {/* Edit Style Modal */}
      <FormModal
        open={isEditStyleOpen}
        onClose={() => setIsEditStyleOpen(false)}
        title="Edit Item"
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
            basePrice: style.basePrice ?? 0,
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
                  basePrice: formData.basePrice ?? 0,
                  isFeatured: formData.isFeatured,
                  isDefault: formData.isDefault ?? false,
                  isActive: formData.isActive,
                },
              });
              setIsEditStyleOpen(false);
              toast.success("Item updated", `"${formData.name}" was saved.`);
              refetch();
            } catch (err: any) {
              toast.error("Failed to update item", err?.message || "Please try again.");
            }
          }}
        />
      </FormModal>

      {/* Add Item Modal - two steps: create the Item, then immediately pick
          which Colour/Size/etc. values it comes in, right here. */}
      <FormModal
        open={isAddItemOpen}
        onClose={() => {
          setIsAddItemOpen(false);
          setNewlyCreatedItem(null);
        }}
        title={newlyCreatedItem ? "Choose Attribute Values" : "Add Item"}
        description={
          newlyCreatedItem
            ? `Pick which ${colorColumnLabel}/${sizeColumnLabel}/etc. values "${newlyCreatedItem.name}" comes in`
            : `Create a new sub-variant under "${style.name}" (e.g. "Regular Fit", "Slim Fit")`
        }
        size="lg"
      >
        {!newlyCreatedItem ? (
          <ItemForm
            isLoading={createItemMutation.isPending}
            submitLabel="Next: Attribute Values"
            onSubmit={async (formData: ItemFormValues) => {
              try {
                const res = await createItemMutation.mutateAsync({
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
                const created = (res as any)?.data as AdminItemResponse | undefined;
                if (created) setNewlyCreatedItem(created);
                toast.success("Item created", `"${formData.name}" is ready for Colors & Sizes.`);
                refetchItems();
              } catch (err: any) {
                toast.error("Failed to create item", err?.message || "Please try again.");
              }
            }}
          />
        ) : (
          productUuid && (
            <div className="space-y-4">
              <ItemAttributesPanel
                productUuid={productUuid}
                itemUuid={newlyCreatedItem.id}
                itemSlug={newlyCreatedItem.slug}
                onGenerated={() => {
                  refetchItems();
                  refetchProductVariants();
                }}
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    setIsAddItemOpen(false);
                    setNewlyCreatedItem(null);
                  }}
                  className="h-10 rounded-xl bg-neutral-100 text-neutral-800 border border-neutral-300 hover:bg-neutral-200 px-5 text-sm font-semibold cursor-pointer"
                >
                  Done
                </Button>
              </div>
            </div>
          )
        )}
      </FormModal>

      {/* Edit Attribute Values Modal - which Color/Size/etc. values (from the
          Product's configured attributes) this Item comes in. */}
      <FormModal
        open={Boolean(attributesItem)}
        onClose={() => setAttributesItem(null)}
        title="Edit Attribute Values"
        description={`Pick which ${colorColumnLabel}/${sizeColumnLabel}/etc. values "${attributesItem?.name || ""}" comes in`}
        size="lg"
      >
        {attributesItem && productUuid && (
          <ItemAttributesPanel
            productUuid={productUuid}
            itemUuid={attributesItem.id}
            itemSlug={attributesItem.slug}
            onGenerated={() => {
              refetchItems();
              refetchProductVariants();
            }}
          />
        )}
      </FormModal>

      {/* Manage Colors & Sizes Modal - the actual generated variants (real
          SKUs with their own price/stock/images) for this Item, editable
          right here instead of sending the admin to the separate variants
          page. */}
      <FormModal
        open={
          Boolean(manageColorsItem) &&
          !isAddVariantOpen &&
          !editingVariant &&
          !managingImagesVariant &&
          !isBulkGenerateOpen &&
          !isBulkEditPricesOpen
        }
        onClose={() => setManageColorsItem(null)}
        title="Manage Colors & Sizes"
        description={`${colorColumnLabel} & ${sizeColumnLabel} for "${manageColorsItem?.name || ""}"`}
        size="xl"
      >
        {manageColorsItem && productUuid && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsBulkGenerateOpen(true)}
                  className="h-9 rounded-lg border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                  Bulk Generate
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsBulkEditPricesOpen(true)}
                  className="h-9 rounded-lg border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  <IndianRupee className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                  Bulk Edit Prices
                </Button>
              </div>
              <Button
                type="button"
                onClick={() => setIsAddVariantOpen(true)}
                className="h-9 rounded-lg bg-[var(--color-secondary-600)] px-4 text-xs font-semibold text-white hover:bg-[var(--color-secondary-700)]"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add {colorColumnLabel}
              </Button>
            </div>

            {manageColorsVariants.length === 0 ? (
              <div className="text-center py-10 px-4 border border-dashed border-neutral-200 rounded-xl">
                <Layers className="mx-auto h-8 w-8 text-neutral-300" />
                <p className="mt-2 text-sm font-semibold text-neutral-900">
                  No {colorColumnLabel} added yet
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Pick attribute values and use Generate Variants, or add one directly here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {manageColorsVariants.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    productUuid={productUuid}
                    onEdit={(v) => setEditingVariant(v)}
                    onManageImages={(v) => setManagingImagesVariant(v)}
                    onDelete={(v) => setDeletingVariant(v)}
                    onToggleStatus={async (v, nextActive) => {
                      try {
                        await updateVariantMutation.mutateAsync({
                          productUuid,
                          variantUuid: v.id,
                          data: { isActive: nextActive },
                        });
                        refetchProductVariants();
                      } catch (err: any) {
                        toast.error("Failed to update status", err?.message || "Please try again.");
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </FormModal>

      {/* Add Color/Size Modal */}
      <FormModal
        open={isAddVariantOpen}
        onClose={() => {
          setIsAddVariantOpen(false);
          setNewlyCreatedVariant(null);
        }}
        title={newlyCreatedVariant ? "Add Units & Pricing" : `Add ${colorColumnLabel}`}
        description={
          newlyCreatedVariant
            ? `Add at least one unit + price combination for ${newlyCreatedVariant.variantName}`
            : `Create a new ${colorColumnLabel} for "${manageColorsItem?.name || ""}"`
        }
        size="lg"
      >
        {!newlyCreatedVariant ? (
          manageColorsItem &&
          productUuid && (
            <VariantForm
              fixedProductId={productUuid}
              fixedProductSlug={style?.productSlug}
              categoryUuid={style?.categoryId}
              isLoading={createVariantMutation.isPending}
              submitLabel="Next: Units & Pricing"
              onSubmit={async (formData: VariantFormValues) => {
                try {
                  const res = await createVariantMutation.mutateAsync({
                    productUuid,
                    itemUuid: manageColorsItem.id,
                    data: {
                      variantName: formData.variantName,
                      slug: formData.slug,
                      priceAdjustment: formData.priceAdjustment ?? 0,
                      isFeatured: formData.isFeatured,
                      isActive: formData.isActive,
                      attributeValueIds: formData.attributeValueIds || [],
                    },
                  });
                  if (res && (res as any).data) {
                    setNewlyCreatedVariant((res as any).data);
                  }
                } catch (err: any) {
                  toast.error("Failed to add", err?.message || "Please try again.");
                }
              }}
            />
          )
        ) : (
          productUuid && (
            <div className="space-y-4">
              <VariantUnitPriceList
                productUuid={productUuid}
                variantUuid={newlyCreatedVariant.id}
                categoryUuid={style?.categoryId || null}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={async () => {
                    if (hasNewlyCreatedPrices) {
                      try {
                        await updateVariantMutation.mutateAsync({
                          productUuid,
                          variantUuid: newlyCreatedVariant.id,
                          data: { isActive: true },
                        });
                      } catch (err: any) {
                        toast.error("Failed to activate", err?.message || "Please try again.");
                      }
                    }
                    setIsAddVariantOpen(false);
                    setNewlyCreatedVariant(null);
                    refetchProductVariants();
                    refetchItems();
                  }}
                  className="h-10 rounded-xl bg-[var(--color-secondary-600)] px-5 text-sm font-semibold text-white hover:bg-[var(--color-secondary-700)] cursor-pointer"
                >
                  Done
                </Button>
              </div>
            </div>
          )
        )}
      </FormModal>

      {/* Edit Color/Size Modal */}
      <FormModal
        open={Boolean(editingVariant)}
        onClose={() => setEditingVariant(null)}
        title={`Edit ${colorColumnLabel}`}
        description={`Update ${editingVariant?.variantName || ""}`}
        size="lg"
      >
        {editingVariant && productUuid && (
          <div className="space-y-6">
            <VariantForm
              initialData={{
                variantName: editingVariant.variantName,
                slug: editingVariant.slug || "",
                priceAdjustment: editingVariant.priceAdjustment ?? 0,
                isFeatured: editingVariant.isFeatured ?? false,
                isActive: editingVariant.isActive ?? false,
                attributeValueIds: (editingVariant.attributeValues || []).map((av) => av.valueId),
              }}
              isEditing
              fixedProductId={productUuid}
              fixedProductSlug={style?.productSlug}
              categoryUuid={style?.categoryId}
              isLoading={updateVariantMutation.isPending}
              submitLabel="Save Changes"
              onSubmit={async (formData: VariantFormValues) => {
                try {
                  await updateVariantMutation.mutateAsync({
                    productUuid,
                    variantUuid: editingVariant.id,
                    data: {
                      variantName: formData.variantName,
                      slug: formData.slug,
                      priceAdjustment: formData.priceAdjustment ?? 0,
                      isFeatured: formData.isFeatured,
                      isActive: formData.isActive,
                      attributeValueIds: formData.attributeValueIds || [],
                    },
                  });
                  toast.success("Updated", `"${formData.variantName || editingVariant.variantName}" was saved.`);
                  setEditingVariant(null);
                  refetchProductVariants();
                } catch (err: any) {
                  toast.error("Failed to update", err?.message || "Please try again.");
                }
              }}
            />
            <VariantUnitPriceList
              productUuid={productUuid}
              variantUuid={editingVariant.id}
              categoryUuid={style?.categoryId || null}
            />
          </div>
        )}
      </FormModal>

      {/* Manage Images Modal */}
      <FormModal
        open={Boolean(managingImagesVariant)}
        onClose={() => setManagingImagesVariant(null)}
        title="Manage Images"
        description={`Images for ${managingImagesVariant?.variantName || ""}`}
        size="lg"
      >
        {managingImagesVariant && productUuid && (
          <VariantImageUploader
            productUuid={productUuid}
            variantUuid={managingImagesVariant.id}
            variantName={managingImagesVariant.variantName}
          />
        )}
      </FormModal>

      {/* Delete Color/Size Confirmation */}
      <ConfirmDialog
        open={!!deletingVariant}
        onClose={() => setDeletingVariant(null)}
        onConfirm={async () => {
          if (!deletingVariant || !productUuid) return;
          const target = deletingVariant;
          setDeletingVariant(null);
          try {
            await deleteVariantMutation.mutateAsync({
              productUuid,
              variantUuid: target.id,
            });
            toast.success("Deleted", `"${target.variantName}" was removed.`);
            refetchProductVariants();
            refetchItems();
          } catch (err: any) {
            toast.error("Failed to delete", err?.message || "Please try again.");
          }
        }}
        title={`Delete ${colorColumnLabel}`}
        description={`Are you sure you want to delete "${deletingVariant?.variantName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteVariantMutation.isPending}
      />

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

        {/* Which Colour/Sizes/etc. values this Item comes in - editable right
            here alongside its name/price instead of a separate step. */}
        {editingItem && productUuid && (
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <h3 className="text-sm font-bold text-neutral-900 mb-1">Attribute Values</h3>
            <ItemAttributesPanel
              productUuid={productUuid}
              itemUuid={editingItem.id}
              itemSlug={editingItem.slug}
              onGenerated={() => {
                refetchItems();
                refetchProductVariants();
              }}
            />
          </div>
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
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteItemMutation.isPending}
      />

      {/* Bulk Generate Modal */}
      <FormModal
        open={isBulkGenerateOpen}
        onClose={() => setIsBulkGenerateOpen(false)}
        title="Bulk Generate Color & Size Combinations"
        description={`Automatically generate variants for "${manageColorsItem?.name || ""}"`}
        size="lg"
      >
        {manageColorsItem && productUuid && (
          <VariantGenerator
            productUuid={productUuid}
            itemUuid={manageColorsItem.id}
            onGenerated={() => {
              setIsBulkGenerateOpen(false);
              refetchProductVariants();
              refetchItems();
              toast.success("Variants generated successfully!");
            }}
          />
        )}
      </FormModal>

      {/* Bulk Edit Prices Modal */}
      {manageColorsItem && productUuid && (
        <ProductPriceEditModal
          open={isBulkEditPricesOpen}
          onClose={() => {
            setIsBulkEditPricesOpen(false);
            refetchProductVariants();
          }}
          productUuid={productUuid}
          productName={manageColorsItem.name}
          variants={manageColorsVariants}
          onSuccess={() => {
            refetchProductVariants();
          }}
        />
      )}
    </div>
  );
}
