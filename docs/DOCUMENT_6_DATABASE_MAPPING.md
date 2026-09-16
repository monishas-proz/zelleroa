# Document 6 — Database Mapping

## Table of Contents
1. [Database Overview](#database-overview)
2. [Model Groups](#model-groups)
3. [Relationships](#relationships)
4. [Key Models Detail](#key-models-detail)
5. [Missing Relationships](#missing-relationships)
6. [Required Changes](#required-changes)

---

## 6.1 Database Overview

| Attribute | Value |
|---|---|
| **Database** | MariaDB/MySQL |
| **ORM** | Prisma 7.9.1 |
| **Models** | 93 |
| **Enums** | 31 |
| **Migrations** | 12 (from baseline) |

---

## 6.2 Model Groups

### 6.2.1 Auth & RBAC Models

| Model | Purpose | Key Fields |
|---|---|---|
| `Role` | User roles | id, name, description |
| `Permission` | Permissions | id, module, action |
| `RolePermission` | Role-permission mapping | roleId, permissionId |
| `User` | User accounts | id, name, email, phone, password, role, status |
| `user_sessions` | Active sessions | id, userId, token, expiresAt |
| `login_logs` | Login history | id, userId, ip, userAgent, timestamp |
| `otp_verifications` | OTP storage | id, email, phone, otp, type, expiresAt |

### 6.2.2 Catalog Models

| Model | Purpose | Key Fields |
|---|---|---|
| `Product` | Products | id, name, slug, description, categoryId, brandId, status |
| `ProductVariant` | Product variants | id, productId, sku, status |
| `VariantUnitPrice` | Variant pricing | id, variantId, unitId, price, mrp, cost |
| `ProductCategory` | Categories | id, name, slug, parentId, status |
| `ProductBrand` | Brands | id, name, slug, logo, status |
| `ProductAttribute` | Attribute definitions | id, name, type |
| `AttributeValue` | Attribute values | id, attributeId, value |
| `ProductImage` | Product images | id, productId, variantId, url, alt, isPrimary |
| `product_units` | Units of measurement | id, name, symbol |
| `product_tags` | Product tags | id, productId, tag |
| `product_gst_rates` | GST rates | id, name, rate |
| `product_hsn_codes` | HSN codes | id, code, description |

### 6.2.3 Commerce Models

| Model | Purpose | Key Fields |
|---|---|---|
| `Cart` | Shopping carts | id, userId, sessionId |
| `CartItem` | Cart items | id, cartId, variantId, quantity |
| `WishlistItem` | Wishlist items | id, userId, variantId |
| `Order` | Orders | id, orderNumber, userId, status, total |
| `OrderItem` | Order items | id, orderId, variantId, quantity, price |
| `OrderAddress` | Order shipping address | id, orderId, name, phone, address, city, state, pincode |
| `order_status_history` | Status changes | id, orderId, status, note, createdAt |
| `Coupon` | Discount coupons | id, code, type, value, minOrder, maxDiscount, startDate, endDate |
| `coupon_usage` | Coupon usage tracking | id, couponId, userId, orderId |
| `Offer` | Promotional offers | id, name, type, discountType, value, startDate, endDate |
| `offer_products` | Offer-product mapping | id, offerId, productId |
| `offer_items` | Offer items | id, offerId, targetType, targetId |

### 6.2.4 Payment Models

| Model | Purpose | Key Fields |
|---|---|---|
| `Payment` | Payment records | id, orderId, method, amount, status, transactionId |
| `PaymentTransaction` | Payment transactions | id, paymentId, gateway, response, status |
| `payment_methods` | Payment methods | id, name, status |
| `payment_gateway_webhooks` | Webhook logs | id, gateway, payload, processed |

### 6.2.5 Inventory Models

| Model | Purpose | Key Fields |
|---|---|---|
| `Inventory` | Stock levels | id, variantId, quantity, reserved, reorderLevel |
| `InventoryTransaction` | Stock movements | id, variantId, type, quantity, reference |
| `stock_adjustments` | Manual adjustments | id, variantId, adjustment, reason, createdAt |
| `stock_reports` | Stock reports | id, generatedAt, data |
| `variant_price_history` | Price changes | id, variantId, oldPrice, newPrice, createdAt |

### 6.2.6 Customer-Facing Models

| Model | Purpose | Key Fields |
|---|---|---|
| `CustomerAddress` | Saved addresses | id, userId, name, phone, address, city, state, pincode, isDefault |
| `Review` | Product reviews | id, userId, variantId, rating, comment, status |
| `ReviewImage` | Review images | id, reviewId, url |
| `Blog` | Blog posts | id, title, slug, content, status |
| `Banner` | Promotional banners | id, title, image, position, status |
| `faq` | FAQs | id, question, answer, category, sortOrder |
| `contact_messages` | Contact form submissions | id, name, email, phone, subject, message, status |
| `bulk_order_enquiries` | Bulk order inquiries | id, name, email, phone, product, quantity, status |
| `Newsletter` | Newsletter subscribers | id, email, status |
| `reward_points` | Reward points | id, userId, points, type, reference |
| `Wallet` | Wallet balance | id, userId, balance |

### 6.2.7 Operations Models

| Model | Purpose | Key Fields |
|---|---|---|
| `shipments` | Shipment records | id, orderId, carrier, trackingNumber, status |
| `shipment_tracking` | Tracking updates | id, shipmentId, status, location, timestamp |
| `delivery_slots` | Delivery time slots | id, name, startTime, endTime, status |
| `delivery_partners` | Delivery partners | id, name, phone, email, status |
| `return_requests` | Return requests | id, orderId, reason, status, adminNote |
| `refunds` | Refund records | id, orderId, amount, method, status |
| `shipping_zones` | Shipping zones | id, name, pincodes |
| `shipping_charges` | Shipping rates | id, zoneId, minWeight, maxWeight, charge |
| `pincode_serviceability` | Pincode service check | id, pincode, serviceable, estimatedDays |
| `settings` | Store settings | id, key, value |
| `Company` | Company info | id, name, address, phone, email, gst |
| `seo_meta` | SEO metadata | id, entityType, entityId, title, description, canonical |
| `AuditLog` | Audit trail | id, userId, action, entity, entityId, changes |

### 6.2.8 WhatsApp Models

| Model | Purpose | Key Fields |
|---|---|---|
| `WhatsAppCampaign` | Campaign records | id, name, templateId, status |
| `WhatsAppCampaignRecipient` | Campaign recipients | id, campaignId, phone, status |
| `WhatsAppTemplate` | Message templates | id, name, content, status |

---

## 6.3 Relationships

### Core E-Commerce Relationships

```
User (1) ──→ (N) Cart
Cart (1) ──→ (N) CartItem
CartItem (N) ──→ (1) ProductVariant
ProductVariant (N) ──→ (1) Product

Product (1) ──→ (N) ProductVariant
Product (N) ──→ (1) ProductCategory
Product (N) ──→ (1) ProductBrand
Product (1) ──→ (N) ProductImage
Product (1) ──→ (N) ProductAttribute

ProductVariant (1) ──→ (N) VariantUnitPrice
ProductVariant (1) ──→ (1) Inventory
ProductVariant (1) ──→ (N) ProductImage

User (1) ──→ (N) Order
Order (1) ──→ (N) OrderItem
OrderItem (N) ──→ (1) ProductVariant
Order (1) ──→ (1) OrderAddress
Order (1) ──→ (N) order_status_history
Order (1) ──→ (1) Payment
Order (1) ──→ (1) Shipment

User (1) ──→ (N) WishlistItem
WishlistItem (N) ──→ (1) ProductVariant

User (1) ──→ (N) CustomerAddress

ProductVariant (1) ──→ (N) Review
Review (1) ──→ (N) ReviewImage
User (1) ──→ (N) Review

Coupon (1) ──→ (N) coupon_usage
coupon_usage (N) ──→ (1) User
coupon_usage (N) ──→ (1) Order

Offer (1) ──→ (N) offer_products
offer_products (N) ──→ (1) Product
Offer (1) ──→ (N) offer_items

Inventory (1) ──→ (N) InventoryTransaction
```

### RBAC Relationships

```
User (N) ──→ (1) Role
Role (1) ──→ (N) RolePermission
RolePermission (N) ──→ (1) Permission
```

### Hierarchy Relationships

```
ProductCategory (N) ──→ (1) ProductCategory (parent)
ProductCategory (1) ──→ (N) ProductCategory (children)
```

---

## 6.4 Key Models Detail

### Product

```prisma
model Product {
  id            String           @id @default(uuid())
  name          String
  slug          String           @unique
  description   String?          @db.Text
  categoryId    String
  brandId       String?
  status        ProductStatus    @default(ACTIVE)
  isFeatured    Boolean          @default(false)
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  // Relations
  category      ProductCategory  @relation(fields: [categoryId], references: [id])
  brand         ProductBrand?    @relation(fields: [brandId], references: [id])
  variants      ProductVariant[]
  images        ProductImage[]
  reviews       Review[]
  offerProducts offer_products[]
  tags          product_tags[]
}
```

### ProductVariant

```prisma
model ProductVariant {
  id          String             @id @default(uuid())
  productId   String
  sku         String             @unique
  status      ProductStatus      @default(ACTIVE)
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt

  // Relations
  product     Product            @relation(fields: [productId], references: [id])
  unitPrices  VariantUnitPrice[]
  inventory   Inventory?
  images      ProductImage[]
  cartItems   CartItem[]
  orderItems  OrderItem[]
  wishlistItems WishlistItem[]
  reviews     Review[]
}
```

### VariantUnitPrice

```prisma
model VariantUnitPrice {
  id        String   @id @default(uuid())
  variantId String
  unitId    String
  price     Decimal  @db.Decimal(10, 2)
  mrp       Decimal  @db.Decimal(10, 2)
  cost      Decimal? @db.Decimal(10, 2)

  // Relations
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  unit      product_units  @relation(fields: [unitId], references: [id])
}
```

### Inventory

```prisma
model Inventory {
  id           String    @id @default(uuid())
  variantId    String    @unique
  quantity     Int       @default(0)
  reserved     Int       @default(0)
  reorderLevel Int       @default(10)

  // Relations
  variant      ProductVariant @relation(fields: [variantId], references: [id])
  transactions InventoryTransaction[]
}
```

### Order

```prisma
model Order {
  id          String            @id @default(uuid())
  orderNumber String            @unique
  userId      String
  status      orders_order_status @default(PENDING)
  subtotal    Decimal           @db.Decimal(10, 2)
  shipping    Decimal           @default(0) @db.Decimal(10, 2)
  discount    Decimal           @default(0) @db.Decimal(10, 2)
  total       Decimal           @db.Decimal(10, 2)
  notes       String?           @db.Text
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  // Relations
  user        User              @relation(fields: [userId], references: [id])
  items       OrderItem[]
  address     OrderAddress?
  history     order_status_history[]
  payment     Payment?
  shipment    shipments?
  returns     return_requests[]
  refunds     refunds[]
  couponUsage coupon_usage[]
}
```

### Cart

```prisma
model Cart {
  id        String     @id @default(uuid())
  userId    String?
  sessionId String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  // Relations
  user      User?      @relation(fields: [userId], references: [id])
  items     CartItem[]
}
```

### CartItem

```prisma
model CartItem {
  id        String   @id @default(uuid())
  cartId    String
  variantId String
  quantity  Int      @default(1)

  // Relations
  cart      Cart           @relation(fields: [cartId], references: [id])
  variant   ProductVariant @relation(fields: [variantId], references: [id])
}
```

---

## 6.5 Missing Relationships

### Identified Gaps

1. **Product ↔ Category Attribute Mapping**
   - No model to define which attributes apply to which category
   - Need: `CategoryAttribute` model

2. **Product ↔ Attribute Value Mapping**
   - No direct mapping of attribute values to products
   - Need: `ProductAttributeValue` model

3. **Variant ↔ Attribute Value Mapping**
   - Variants should have attribute values (e.g., Red, Size M)
   - Need: `VariantAttribute` model

4. **Offer ↔ Category Mapping**
   - `offer_products` only maps to products
   - Need: `offer_categories` model for category-level offers

5. **Offer ↔ Brand Mapping**
   - No brand-level offer support
   - Need: `offer_brands` model

6. **Coupon ↔ Category Restriction**
   - Coupons have no category restrictions
   - Need: `coupon_categories` model

7. **Coupon ↔ Product Restriction**
   - Coupons have no product restrictions
   - Need: `coupon_products` model

8. **Order ↔ Coupon Mapping**
   - `coupon_usage` exists but Order doesn't directly reference coupon
   - Need: Add `couponId` to Order model

9. **Product ↔ SEO Metadata**
   - `seo_meta` exists but no direct relation to Product
   - Need: Direct relation or ensure entity type mapping works

10. **Inventory ↔ Reserved Stock**
    - `reserved` field exists but no `reserved_by_order` tracking
    - Need: `InventoryReservation` model

---

## 6.6 Required Changes

### 6.6.1 Category Attributes (Multi-Category Support)

**Current State:** Attributes are generic, not tied to categories.

**Required:**
```prisma
model CategoryAttribute {
  id          String           @id @default(uuid())
  categoryId  String
  attributeId String
  required    Boolean          @default(false)
  sortOrder   Int              @default(0)

  category    ProductCategory  @relation(fields: [categoryId], references: [id])
  attribute   ProductAttribute @relation(fields: [attributeId], references: [id])

  @@unique([categoryId, attributeId])
}
```

### 6.6.2 Variant Attributes (Multi-Attribute Variants)

**Current State:** Variants exist but attribute mapping is unclear.

**Required:**
```prisma
model VariantAttribute {
  id             String           @id @default(uuid())
  variantId      String
  attributeValueId String

  variant        ProductVariant   @relation(fields: [variantId], references: [id])
  attributeValue AttributeValue   @relation(fields: [attributeValueId], references: [id])

  @@unique([variantId, attributeValueId])
}
```

### 6.6.3 Offer Categories & Brands

**Required:**
```prisma
model offer_categories {
  id         String  @id @default(uuid())
  offerId    String
  categoryId String

  offer      Offer      @relation(fields: [offerId], references: [id])
  category   ProductCategory @relation(fields: [categoryId], references: [id])

  @@unique([offerId, categoryId])
}

model offer_brands {
  id      String  @id @default(uuid())
  offerId String
  brandId String

  offer   Offer        @relation(fields: [offerId], references: [id])
  brand   ProductBrand @relation(fields: [brandId], references: [id])

  @@unique([offerId, brandId])
}
```

### 6.6.4 Coupon Restrictions

**Required:**
```prisma
model coupon_categories {
  id         String  @id @default(uuid())
  couponId   String
  categoryId String

  coupon     Coupon         @relation(fields: [couponId], references: [id])
  category   ProductCategory @relation(fields: [categoryId], references: [id])

  @@unique([couponId, categoryId])
}

model coupon_products {
  id        String  @id @default(uuid())
  couponId  String
  productId String

  coupon    Coupon   @relation(fields: [couponId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])

  @@unique([couponId, productId])
}
```

### 6.6.5 Inventory Reservation

**Required:**
```prisma
model InventoryReservation {
  id        String   @id @default(uuid())
  variantId String
  orderId   String
  quantity  Int
  expiresAt DateTime
  status    ReservationStatus @default(ACTIVE)

  variant   ProductVariant @relation(fields: [variantId], references: [id])
  order     Order          @relation(fields: [orderId], references: [id])

  @@unique([variantId, orderId])
}

enum ReservationStatus {
  ACTIVE
  CONFIRMED
  EXPIRED
  RELEASED
}
```

### 6.6.6 Order-Coupon Link

**Required:**
```prisma
// Add to Order model
model Order {
  // ... existing fields
  couponId    String?
  coupon      Coupon?  @relation(fields: [couponId], references: [id])
}
```

---

## 6.7 Database Performance Notes

### Indexes to Verify
- `Product.slug` (unique)
- `ProductVariant.sku` (unique)
- `Order.orderNumber` (unique)
- `Order.userId` (for user order list)
- `Order.status` (for status filtering)
- `CartItem.cartId` (for cart items)
- `Inventory.variantId` (unique)
- `Review.variantId` (for product reviews)
- `WishlistItem.userId` (for user wishlist)

### N+1 Query Risks
- Product listing with variants, images, inventory
- Order listing with items, payments
- Cart with items, variants, products

### Recommended Eager Loading
- Product → Category, Brand, Variants → UnitPrices, Inventory, Images
- Order → Items → Variant → Product
- Cart → Items → Variant → Product, UnitPrice, Inventory

---

## 6.8 Migration Strategy

### Phase 1: Add Missing Models
1. Add `CategoryAttribute` model
2. Add `VariantAttribute` model
3. Add `offer_categories` model
4. Add `offer_brands` model
5. Add `coupon_categories` model
6. Add `coupon_products` model
7. Add `InventoryReservation` model

### Phase 2: Add Missing Relations
1. Add `couponId` to Order model
2. Add direct SEO relations

### Phase 3: Data Migration
1. Map existing attribute values to variants
2. Populate category-attribute mappings
3. Set up coupon/offer restrictions

### Phase 4: Cleanup
1. Remove unused models (if any)
2. Consolidate duplicate tables
3. Add missing indexes