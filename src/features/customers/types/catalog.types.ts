import type { VariantMeasurement } from "@/features/variants/utils/measurement.util";
import type { OfferBreakdown } from "@/features/offers/types";

export interface CustomerBrandDto {
  id: string; // Brand UUID
  name: string;
  image: string | null;
}

export interface CustomerCategoryDto {
  id: string; // Category UUID
  name: string;
  slug: string;
  parentId: string | null;
  image: string | null;
}

export interface CustomerProductListItemDto {
  id: string; // Product UUID
  name: string;
  description: string | null;
  brand: {
    id: string;
    name: string;
  } | null;
  category: {
    id: string;
    name: string;
  } | null;
  image: string | null;
  minPrice: number;
  maxPrice: number;
  /** Distinct Color count across the Style's Items - shown on the storefront card. */
  colorCount?: number;
  unitPrices?: Array<{
    id: string;
    label: string;
    basePrice: number;
    sellingPrice: number;
    /** The offer that produced `sellingPrice`, or null when none applied. */
    offer?: OfferBreakdown | null;
    discountAmount?: number;
    discountPercent?: number;
  }>;
}

/**
 * A single sellable pack size ("250g", "500g", "1kg", ...) for a variant/item.
 * Selling price is NOT stored - the repository returns it equal to basePrice,
 * and `catalogOffers` in the customer service layer replaces it with the price
 * the shared offer engine produces before the DTO leaves the server.
 */
export interface CustomerVariantUnitPriceDto {
  id: string; // VariantUnitPrice UUID - this is what cart/wishlist APIs key off
  sku: string;
  measurement: VariantMeasurement;
  basePrice: number;
  sellingPrice: number;
  isDefault: boolean;
  /** The offer that produced `sellingPrice`, or null when none applied. */
  offer?: OfferBreakdown | null;
  discountAmount?: number;
  discountPercent?: number;
  /** Current available quantity for this exact color+unit combination. */
  stock: number;
  inStock: boolean;
}

export interface CustomerVariantImageDto {
  id: string;
  imageUrl: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface CustomerVariantListItemDto {
  id: string; // Variant UUID (Color level)
  itemId: string; // Item UUID
  itemName: string;
  /** @deprecated use itemId - kept for callers not yet migrated */
  productId: string;
  /** @deprecated use itemName */
  productName: string;
  variantName: string;
  measurement: VariantMeasurement;
  sku: string;
  basePrice: number;
  /** Default pack size's price after offers; mirrors `unitPrices`. */
  salePrice: number;
  primaryImage: string | null;
  /** This variant's color, when the Item distinguishes variants by color. */
  colorName: string | null;
  colorHex: string | null;
  /** Full set of images for this color - the gallery to show when this variant/color is selected. */
  images: CustomerVariantImageDto[];
  outOfStock?: boolean;
  // Full list of sellable Sizes/pack sizes for this color - each independently
  // priced. `sku`/`basePrice`/`salePrice`/`measurement` above mirror the
  // default (or first) entry here for callers that expect a single price/sku.
  unitPrices: CustomerVariantUnitPriceDto[];
  /** This variant's non-color, non-size attribute values (e.g. Fabric=Cotton). */
  attributeValues: Array<{ attributeName: string; valueId: string; value: string }>;
}

export interface CustomerVariantDetailDto extends CustomerVariantListItemDto {
  images: CustomerVariantImageDto[];
}

/**
 * A single sellable style/design under a Product (e.g. Product "T-Shirt" ->
 * Item "V Neck T-Shirt"). Holds the style-level description/ingredients/etc,
 * and the Color variants the customer picks between.
 */
export interface CustomerItemDto {
  id: string; // Item UUID
  productId: string;
  productName: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  ingredients: string | null;
  isReadyToMix: boolean;
  cookingRecipe: string | null;
  shelfLife: string | null;
  vegType: "veg" | "nonveg" | "vegan" | "na";
  isDefault: boolean;
  /** Item-level fallback images, used when this Item has no Color split. */
  images: CustomerVariantImageDto[];
  variants: CustomerVariantListItemDto[];
}

export interface CustomerProductDetailDto {
  id: string; // Product UUID
  name: string;
  description: string | null;
  brand: {
    id: string;
    name: string;
  } | null;
  category: {
    id: string;
    name: string;
  } | null;
  image: string | null;
  gender: "men" | "women" | "kids" | "unisex" | null;
  items: CustomerItemDto[];
}

/**
 * One related item returned by the related-products API. It is variant-level
 * (a single representative variant per related product) so the storefront can
 * link/add straight to a sellable item, while still carrying the product,
 * category and brand context the card needs.
 */
export interface CustomerRelatedVariantDto {
  productId: string; // Product UUID
  productName: string;
  variantId: string; // Variant UUID
  variantName: string;
  measurement: VariantMeasurement;
  sku: string;
  /** The pack size `price`/`offerPrice` refer to - what cart APIs key off. */
  unitPriceId: string | null;
  // `price` is the catalog base price; `offerPrice` is what the shared offer
  // engine charges, and is null when no offer applies.
  price: number;
  offerPrice: number | null;
  image: string | null;
  category: {
    id: string;
    name: string;
  } | null;
  subcategory: {
    id: string;
    name: string;
  } | null;
  brand: {
    id: string;
    name: string;
  } | null;
  inStock: boolean;
  stockQuantity: number;
}
