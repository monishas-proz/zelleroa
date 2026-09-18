"use client";

import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { FormRichText } from "@/components/forms/form-rich-text";
import { FormCheckbox } from "@/components/forms/form-checkbox";
import { FormSubmitButton } from "@/components/forms/form-submit-button";

// The admin-only sub-variant under a Style (e.g. Style "V Neck T-Shirt" -> Item
// "Regular Fit", "Slim Fit", "Oversized"). Never shown to customers. Color/Size
// splits live one/two levels down, managed separately via VariantForm/
// VariantGenerator once the Item exists.
const itemFormSchema = z.object({
  name: z
    .string({ message: "Item name is required" })
    .trim()
    .min(1, "Item name cannot be empty")
    .max(200, "Item name cannot exceed 200 characters"),
  slug: z
    .string({ message: "Item code is required" })
    .trim()
    .min(1, "Item code cannot be empty")
    .max(220, "Item code cannot exceed 220 characters"),
  sku: z.string().trim().max(100, "SKU cannot exceed 100 characters").optional(),
  shortDescription: z
    .string()
    .trim()
    .max(500, "Short description cannot exceed 500 characters")
    .optional(),
  description: z.string().trim().optional(),
  basePrice: z.number().min(0, "Base price cannot be negative"),
  isFeatured: z.boolean(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean(),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;

interface ItemFormProps {
  initialData?: Partial<ItemFormValues>;
  isEditing?: boolean;
  onSubmit: (data: ItemFormValues) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

function ItemForm({
  initialData,
  isEditing: _isEditing = false,
  onSubmit,
  isLoading = false,
  submitLabel = "Save Item",
}: ItemFormProps) {
  const [codeTouched, setCodeTouched] = React.useState<boolean>(() => Boolean(initialData?.slug));

  const methods = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      sku: initialData?.sku || "",
      shortDescription: initialData?.shortDescription || "",
      description: initialData?.description || "",
      basePrice: initialData?.basePrice ?? 0,
      isFeatured: initialData?.isFeatured ?? false,
      isDefault: initialData?.isDefault ?? false,
      isActive: initialData?.isActive ?? false,
    },
  });

  const watchedName = methods.watch("name");

  // Fill in the code from the Item Name automatically, same convention as
  // VariantForm's Item Code field - stops as soon as the admin edits it by hand.
  useEffect(() => {
    if (codeTouched) return;
    const auto = (watchedName || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    methods.setValue("slug", auto, { shouldValidate: methods.formState.isSubmitted });
  }, [watchedName, codeTouched, methods]);

  useEffect(() => {
    if (initialData) {
      methods.reset({
        name: initialData.name || "",
        slug: initialData.slug || "",
        sku: initialData.sku || "",
        shortDescription: initialData.shortDescription || "",
        description: initialData.description || "",
        basePrice: initialData.basePrice ?? 0,
        isFeatured: initialData.isFeatured ?? false,
        isDefault: initialData.isDefault ?? false,
        isActive: initialData.isActive ?? false,
      });
      setCodeTouched(Boolean(initialData.slug));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleSlugChange = (raw: string) => {
    setCodeTouched(true);
    methods.setValue(
      "slug",
      raw
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]+/g, ""),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            name="name"
            label="Item Name"
            placeholder="e.g. Regular Fit, Slim Fit, Oversized"
            required
          />
          <FormInput
            name="basePrice"
            type="number"
            label="Base Price"
            placeholder="e.g. 599"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            name="sku"
            label="Item SKU (optional)"
            placeholder="e.g. TSHIRT-VNECK-REGULAR"
          />
          <div>
            <label className="block text-xs font-semibold text-[var(--color-neutral-800)] mb-1.5">
              Item Code (fills in automatically) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={methods.watch("slug")}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="e.g. regular-fit"
              className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm font-mono bg-white outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-600/20"
            />
            {methods.formState.errors.slug && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {methods.formState.errors.slug.message}
              </p>
            )}
          </div>
        </div>

        <FormTextarea
          name="shortDescription"
          label="Short Description"
          placeholder="Brief summary of the item (max 500 characters)"
          rows={2}
        />

        <FormRichText
          name="description"
          label="Item Description"
          placeholder="Detailed item information and description"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormCheckbox
            name="isFeatured"
            label="Featured Item"
            description="Display prominently in featured sections"
          />
          <FormCheckbox
            name="isDefault"
            label="Default Item"
            description="Auto-selected on the style page"
          />
        </div>

        <FormCheckbox
          name="isActive"
          label="Status: Active"
          description="Inactive items are hidden from customers"
        />

        <div className="flex justify-end pt-2">
          <FormSubmitButton
            isLoading={isLoading}
            className="h-11 rounded-xl bg-[var(--color-secondary-600)] px-6 text-sm font-semibold text-white hover:bg-[var(--color-secondary-700)]"
          >
            {submitLabel}
          </FormSubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}

export { ItemForm };
