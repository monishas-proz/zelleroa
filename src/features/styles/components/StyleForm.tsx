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

// One sellable style/design under a Product (e.g. Product "T-Shirt" -> Item
// "V Neck T-Shirt", "Solo T-Shirt"). Color/Size splits live one level down,
// managed separately via VariantForm/VariantGenerator once the Item exists.
const styleFormSchema = z.object({
  name: z
    .string({ message: "Style name is required" })
    .trim()
    .min(1, "Style name cannot be empty")
    .max(200, "Style name cannot exceed 200 characters"),
  slug: z
    .string({ message: "Style code is required" })
    .trim()
    .min(1, "Style code cannot be empty")
    .max(220, "Style code cannot exceed 220 characters"),
  sku: z.string().trim().max(100, "SKU cannot exceed 100 characters").optional(),
  shortDescription: z
    .string()
    .trim()
    .max(500, "Short description cannot exceed 500 characters")
    .optional(),
  description: z.string().trim().optional(),
  cookingRecipe: z.string().trim().optional(),
  isFeatured: z.boolean(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean(),
});

export type StyleFormValues = z.infer<typeof styleFormSchema>;

interface StyleFormProps {
  initialData?: Partial<StyleFormValues>;
  isEditing?: boolean;
  onSubmit: (data: StyleFormValues) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

function StyleForm({
  initialData,
  isEditing: _isEditing = false,
  onSubmit,
  isLoading = false,
  submitLabel = "Save Style",
}: StyleFormProps) {
  const [codeTouched, setCodeTouched] = React.useState<boolean>(() => Boolean(initialData?.slug));

  const methods = useForm<StyleFormValues>({
    resolver: zodResolver(styleFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      sku: initialData?.sku || "",
      shortDescription: initialData?.shortDescription || "",
      description: initialData?.description || "",
      cookingRecipe: initialData?.cookingRecipe || "",
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
        cookingRecipe: initialData.cookingRecipe || "",
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
            label="Style Name"
            placeholder="e.g. V Neck T-Shirt, Solo T-Shirt"
            required
          />
          <FormInput
            name="sku"
            label="Style SKU (optional)"
            placeholder="e.g. TSHIRT-VNECK"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-neutral-800)] mb-1.5">
            Style Code (fills in automatically) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={methods.watch("slug")}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="e.g. v-neck-t-shirt"
            className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm font-mono bg-white outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-600/20"
          />
          {methods.formState.errors.slug && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {methods.formState.errors.slug.message}
            </p>
          )}
        </div>

        <FormTextarea
          name="shortDescription"
          label="Short Description"
          placeholder="Brief summary of the style (max 500 characters)"
          rows={2}
        />

        <FormRichText
          name="description"
          label="Description"
          placeholder="Detailed style information and description"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormCheckbox
            name="isFeatured"
            label="Featured Style"
            description="Display prominently in featured sections"
          />
          <FormCheckbox
            name="isDefault"
            label="Default Style"
            description="Auto-selected on the product page"
          />
        </div>

        <FormCheckbox
          name="isActive"
          label="Active"
          description="Inactive styles are hidden from customers"
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

export { StyleForm };
