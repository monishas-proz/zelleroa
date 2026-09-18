import type { PaginationMeta } from "@/lib/api/api-response";

export interface AdminItemResponse {
  id: string; // Public Item UUID
  styleId: string; // Public Style UUID
  styleName: string;
  styleSlug: string;
  name: string;
  slug: string;
  sku: string | null;
  shortDescription: string | null;
  description: string | null;
  basePrice: number;
  isFeatured: boolean;
  isDefault: boolean;
  isActive: boolean;
  outOfStock: boolean;
  colorCount: number;
  sizeCount: number;
  minPrice: number | null;
  maxPrice: number | null;
  totalStock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAdminItemsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export interface GetAdminItemsResult {
  data: AdminItemResponse[];
  meta?: PaginationMeta;
}

export type {
  CreateAdminItemInput,
  UpdateAdminItemInput,
  AdminItemListQueryInput,
} from "../validations/admin-item.schema";
