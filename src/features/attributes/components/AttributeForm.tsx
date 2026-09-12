"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { FormInput } from "@/components/forms/form-input";
import { FormSubmitButton } from "@/components/forms/form-submit-button";

const attributeFormSchema = z.object({
  name: z
    .string({ message: "Attribute name is required" })
    .trim()
    .min(1, "Attribute name cannot be empty")
    .max(100, "Attribute name cannot exceed 100 characters"),
  slug: z
    .string({ message: "Attribute code is required" })
    .trim()
    .min(1, "Attribute code cannot be empty")
    .max(120, "Attribute code cannot exceed 120 characters")
    .regex(/^[A-Za-z0-9_]+$/, "Use letters, numbers, and underscores only"),
});

export type AttributeFormValues = z.infer<typeof attributeFormSchema>;

interface AttributeFormProps {
  initialData?: Partial<AttributeFormValues>;
  isEditing?: boolean;
  showInitialValues?: boolean;
  onSubmit: (data: AttributeFormValues & { values?: string[] }) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

function AttributeForm({
  initialData,
  showInitialValues = false,
  onSubmit,
  isLoading = false,
  submitLabel = "Save Attribute",
}: AttributeFormProps) {
  const [pendingValues, setPendingValues] = useState<string[]>([]);
  const [valueDraft, setValueDraft] = useState("");

  const methods = useForm<AttributeFormValues>({
    resolver: zodResolver(attributeFormSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
    },
  });

  const handleAddValue = () => {
    const v = valueDraft.trim();
    if (!v) return;
    if (pendingValues.some((existing) => existing.toLowerCase() === v.toLowerCase())) {
      setValueDraft("");
      return;
    }
    setPendingValues((prev) => [...prev, v]);
    setValueDraft("");
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data) =>
          onSubmit({ ...data, values: showInitialValues ? pendingValues : undefined })
        )}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            name="name"
            label="Attribute Name"
            placeholder="e.g. Fabric, Dial Color, Bag Type"
            required
          />

          <FormInput
            name="slug"
            label="Attribute Code"
            placeholder="e.g. FABRIC"
            infoMessage="Use letters, numbers, and underscores only."
            required
          />
        </div>

        {showInitialValues && (
          <div>
            <label className="block text-xs font-semibold text-[var(--color-neutral-800)] mb-1.5">
              Values (optional — you can add more later)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={valueDraft}
                onChange={(e) => setValueDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddValue();
                  }
                }}
                placeholder="e.g. Cotton"
                className="flex-1 min-w-0 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-600/20"
              />
              <button
                type="button"
                onClick={handleAddValue}
                className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            {pendingValues.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {pendingValues.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary-50 px-2.5 py-1 text-xs font-medium text-secondary-700"
                  >
                    {v}
                    <button
                      type="button"
                      onClick={() => setPendingValues((prev) => prev.filter((x) => x !== v))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

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

export { AttributeForm };
