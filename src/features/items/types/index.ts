import type { PaginationMeta } from "@/lib/api/api-response";

/** One value selected on an Item (e.g. "Red") for an attribute, used to render
 * value chips in the Item tables and on the Item/Style value summary. */
export interface AdminItemSelectedValue {
  id: string; // AttributeValue UUID
  value: string;
  colorHex?: string | null;
  imageUrl?: string | null;
}

/** Selected attribute values on an Item, grouped per attribute (e.g. Color ->
 * Red/Blue/Black) so tables can show one row per attribute instead of one row
 * per value. */
export interface AdminItemSelectedAttribute {
  id: string; // Attribute UUID
  name: string;
  slug: string;
  type: "text" | "color";
  multipleSelection: boolean;
  values: AdminItemSelectedValue[];
}

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
  /** Attribute values already picked on this Item (via Edit Attribute Values)
   * that haven't been turned into real Colors/Sizes yet via Generate Variants -
   * lets the Items table hint "values selected" even while colorCount/sizeCount
   * still read 0. */
  selectedColorValueCount: number;
  selectedOtherValueCount: number;
  /** The Item's selected attribute values, grouped per attribute, in the
   * Product's configured-attribute order - drives the value chips shown in the
   * Items tables and the Item/Style "Selected Values" summary. */
  selectedAttributes: AdminItemSelectedAttribute[];
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
