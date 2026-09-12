export interface AttributeValueItem {
  id: string; // Public UUID
  value: string;
  isActive: boolean;
  createdAt: Date;
}

export interface AttributeListItem {
  id: string; // Public UUID
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  values: AttributeValueItem[];
  categoryIds: string[];
  _count?: { values?: number };
}

export interface GetAdminAttributesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
}

export interface CategoryAttributeOption {
  id: string; // Attribute UUID
  name: string;
  slug: string;
  isRequired: boolean;
  values: AttributeValueItem[];
}
