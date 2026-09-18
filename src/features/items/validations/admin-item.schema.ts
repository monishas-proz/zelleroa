import { z } from "zod";

export const createAdminItemSchema = z
  .object({
    name: z
      .string({ message: "Item name is required" })
      .trim()
      .min(1, "Item name cannot be empty")
      .max(200, "Item name cannot exceed 200 characters"),
    slug: z
      .string({ message: "Slug is required" })
      .trim()
      .min(1, "Slug cannot be empty")
      .max(220, "Slug cannot exceed 220 characters"),
    sku: z.string().trim().max(100, "SKU cannot exceed 100 characters").optional().nullable(),
    shortDescription: z
      .string()
      .trim()
      .max(500, "Short description cannot exceed 500 characters")
      .optional()
      .nullable(),
    description: z.string().trim().optional().nullable(),
    basePrice: z.coerce.number().min(0, "Base price cannot be negative").optional().default(0),
    isFeatured: z.boolean().optional().default(false),
    isDefault: z.boolean().optional().default(false),
    isActive: z.boolean().optional().default(false),
    outOfStock: z.boolean().optional().default(false),
  })
  .strict();

export type CreateAdminItemInput = z.infer<typeof createAdminItemSchema>;

export const updateAdminItemSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Item name cannot be empty")
      .max(200, "Item name cannot exceed 200 characters")
      .optional(),
    slug: z
      .string()
      .trim()
      .min(1, "Slug cannot be empty")
      .max(220, "Slug cannot exceed 220 characters")
      .optional(),
    sku: z.string().trim().max(100, "SKU cannot exceed 100 characters").optional().nullable(),
    shortDescription: z
      .string()
      .trim()
      .max(500, "Short description cannot exceed 500 characters")
      .optional()
      .nullable(),
    description: z.string().trim().optional().nullable(),
    basePrice: z.coerce.number().min(0, "Base price cannot be negative").optional(),
    isFeatured: z.boolean().optional(),
    isDefault: z.boolean().optional(),
    isActive: z.boolean().optional(),
    outOfStock: z.boolean().optional(),
  })
  .strict();

export type UpdateAdminItemInput = z.infer<typeof updateAdminItemSchema>;

export const adminItemListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(),
  search: z.string().trim().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type AdminItemListQueryInput = z.infer<typeof adminItemListQuerySchema>;
