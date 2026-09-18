export type AttributeType = "text" | "color";

export interface AttributeValueItem {
  id: string; // Public UUID
  value: string;
  colorHex?: string | null;
  isActive: boolean;
  createdAt: Date;
  priceAdjustment: number;
}

export interface AttributeListItem {
  id: string; // Public UUID
  name: string;
  slug: string;
  type: AttributeType;
  isActive: boolean;
  createdAt: Date;
  values: AttributeValueItem[];
  _count?: { values?: number };
}

export interface GetAdminAttributesParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

/** One attribute configured on a Product, with its selectable values (e.g.
 * Color: Black/White with hex codes) - powers the single-variant Add/Edit
 * Item form and the bulk Generate Variants form. */
export interface ConfiguredProductAttribute {
  id: string; // Attribute UUID
  name: string;
  slug: string;
  type: AttributeType;
  isRequired: boolean;
  values: AttributeValueItem[];
}

/** One attribute configured on a Product, with whether it's currently enabled. */
export interface ProductAttributeConfigOption {
  id: string; // Attribute UUID
  name: string;
  slug: string;
  type: AttributeType;
  configured: boolean;
  isRequired: boolean;
  sortOrder: number;
}

/** One attribute value under an Item, with whether it's currently selected. */
export interface ItemAttributeValueOption {
  id: string; // AttributeValue UUID
  value: string;
  colorHex?: string | null;
  selected: boolean;
}

/** One Product-configured attribute rendered on the Item form, with its
 * values flagged for whether this specific Item currently has them selected. */
export interface ItemAttributeGroup {
  id: string; // Attribute UUID
  name: string;
  slug: string;
  type: AttributeType;
  isRequired: boolean;
  values: ItemAttributeValueOption[];
}

export interface ProductAttributeUsage {
  attributeId: string;
  attributeName: string;
  itemCount: number;
  variantCount: number;
}
