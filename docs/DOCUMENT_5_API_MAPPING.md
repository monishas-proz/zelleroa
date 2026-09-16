# Document 5 — API Mapping

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Customer APIs](#customer-apis)
3. [Admin APIs](#admin-apis)
4. [Page → API → Database Mapping](#page--api--database-mapping)

---

## 5.1 Authentication APIs

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| POST | `/api/auth/login` | User login | No | Any |
| POST | `/api/auth/logout` | User logout | Yes | Any |
| POST | `/api/auth/register` | User registration | No | - |
| POST | `/api/auth/refresh` | Refresh token | Yes | Any |
| POST | `/api/auth/forgot-password` | Send reset OTP | No | - |
| POST | `/api/auth/reset-password` | Reset password | No | - |
| POST | `/api/auth/verify-otp` | Verify OTP | No | - |
| POST | `/api/auth/verify-email-otp` | Verify email OTP | No | - |
| POST | `/api/auth/send-email-otp` | Send email OTP | No | - |
| POST | `/api/auth/resend-register-otp` | Resend registration OTP | No | - |
| POST | `/api/auth/resend-forgot-password-otp` | Resend forgot password OTP | No | - |
| GET | `/api/auth/[...nextauth]` | NextAuth handlers | No | - |

---

## 5.2 Customer APIs

### Products

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/customer/products` | List products | No | Customer |
| GET | `/api/customer/products/[slug]` | Get product by slug | No | Customer |
| GET | `/api/customer/products/[slug]/related` | Related products | No | Customer |
| GET | `/api/customer/products/[slug]/reviews` | Product reviews | No | Customer |
| POST | `/api/customer/variants` | List variants (paginated) | No | Customer |
| GET | `/api/customer/variants/[id]` | Get variant details | No | Customer |

### Cart

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/customer/cart` | Get cart | Yes | Customer |
| POST | `/api/customer/cart` | Add to cart | Yes | Customer |
| PATCH | `/api/customer/cart/items/[id]` | Update quantity | Yes | Customer |
| DELETE | `/api/customer/cart/items/[id]` | Remove item | Yes | Customer |
| DELETE | `/api/customer/cart` | Clear cart | Yes | Customer |
| GET | `/api/customer/cart/count` | Cart item count | Yes | Customer |

### Wishlist

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/customer/wishlist` | Get wishlist | Yes | Customer |
| POST | `/api/customer/wishlist` | Add to wishlist | Yes | Customer |
| DELETE | `/api/customer/wishlist/[id]` | Remove from wishlist | Yes | Customer |
| POST | `/api/customer/wishlist/[id]/move-to-cart` | Move to cart | Yes | Customer |
| GET | `/api/customer/wishlist/count` | Wishlist item count | Yes | Customer |

### Orders

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/customer/orders` | List orders | Yes | Customer |
| GET | `/api/customer/orders/[id]` | Get order details | Yes | Customer |
| PATCH | `/api/customer/orders/[id]/cancel` | Cancel order | Yes | Customer |
| POST | `/api/customer/orders/[id]/return` | Request return | Yes | Customer |

### Addresses

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/customer/addresses` | List addresses | Yes | Customer |
| POST | `/api/customer/addresses` | Create address | Yes | Customer |
| PUT | `/api/customer/addresses/[id]` | Update address | Yes | Customer |
| DELETE | `/api/customer/addresses/[id]` | Delete address | Yes | Customer |

### Reviews

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| POST | `/api/customer/reviews` | Create review | Yes | Customer |
| GET | `/api/customer/reviews` | List reviews | Yes | Customer |

### Payments

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| POST | `/api/customer/payment/create-order` | Create Razorpay order | Yes | Customer |
| POST | `/api/customer/payment/verify` | Verify payment | Yes | Customer |

### Profile

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/customer/profile` | Get profile | Yes | Customer |
| PUT | `/api/customer/profile` | Update profile | Yes | Customer |
| POST | `/api/customer/profile/image` | Upload profile image | Yes | Customer |

### Categories & Brands

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/customer/categories` | List categories | No | Customer |
| GET | `/api/customer/categories/tree` | Category tree | No | Customer |
| GET | `/api/customer/brands` | List brands | No | Customer |

### Other

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/customer/banners` | List banners | No | Customer |
| GET | `/api/customer/company` | Company info | No | Customer |

---

## 5.3 Admin APIs

### Products

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/products` | List products | Yes | Admin/Staff |
| POST | `/api/admin/products` | Create product | Yes | Admin/Staff |
| GET | `/api/admin/products/[id]` | Get product | Yes | Admin/Staff |
| PUT | `/api/admin/products/[id]` | Update product | Yes | Admin/Staff |
| DELETE | `/api/admin/products/[id]` | Delete product | Yes | Admin/Staff |
| POST | `/api/admin/products/[id]/images` | Upload images | Yes | Admin/Staff |
| DELETE | `/api/admin/products/[id]/images/[imageId]` | Delete image | Yes | Admin/Staff |

### Product Variants

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/products/[id]/variants` | List variants | Yes | Admin/Staff |
| POST | `/api/admin/products/[id]/variants` | Create variant | Yes | Admin/Staff |
| PUT | `/api/admin/products/[id]/variants/[variantId]` | Update variant | Yes | Admin/Staff |
| DELETE | `/api/admin/products/[id]/variants/[variantId]` | Delete variant | Yes | Admin/Staff |
| POST | `/api/admin/products/[id]/variants/[variantId]/unit-prices` | Add unit price | Yes | Admin/Staff |
| PUT | `/api/admin/products/[id]/variants/[variantId]/unit-prices/[unitPriceId]` | Update unit price | Yes | Admin/Staff |
| DELETE | `/api/admin/products/[id]/variants/[variantId]/unit-prices/[unitPriceId]` | Delete unit price | Yes | Admin/Staff |

### Categories

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/categories` | List categories | Yes | Admin/Staff |
| POST | `/api/admin/categories` | Create category | Yes | Admin |
| PUT | `/api/admin/categories/[id]` | Update category | Yes | Admin |
| DELETE | `/api/admin/categories/[id]` | Delete category | Yes | Admin |

### Subcategories

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/subcategories` | List subcategories | Yes | Admin/Staff |
| POST | `/api/admin/subcategories` | Create subcategory | Yes | Admin |
| PUT | `/api/admin/subcategories/[id]` | Update subcategory | Yes | Admin |
| DELETE | `/api/admin/subcategories/[id]` | Delete subcategory | Yes | Admin |

### Brands

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/brands` | List brands | Yes | Admin/Staff |
| POST | `/api/admin/brands` | Create brand | Yes | Admin |
| PUT | `/api/admin/brands/[id]` | Update brand | Yes | Admin |
| DELETE | `/api/admin/brands/[id]` | Delete brand | Yes | Admin |

### Attributes

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/attributes` | List attributes | Yes | Admin/Staff |
| POST | `/api/admin/attributes` | Create attribute | Yes | Admin |
| PUT | `/api/admin/attributes/[id]` | Update attribute | Yes | Admin |
| DELETE | `/api/admin/attributes/[id]` | Delete attribute | Yes | Admin |

### Units

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/units` | List units | Yes | Admin/Staff |
| POST | `/api/admin/units` | Create unit | Yes | Admin |
| PUT | `/api/admin/units/[id]` | Update unit | Yes | Admin |
| DELETE | `/api/admin/units/[id]` | Delete unit | Yes | Admin |

### GST Rates

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/gst-rates` | List GST rates | Yes | Admin/Staff |
| POST | `/api/admin/gst-rates` | Create GST rate | Yes | Admin |
| PUT | `/api/admin/gst-rates/[id]` | Update GST rate | Yes | Admin |
| DELETE | `/api/admin/gst-rates/[id]` | Delete GST rate | Yes | Admin |

### HSN Codes

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/hsn-codes` | List HSN codes | Yes | Admin/Staff |
| POST | `/api/admin/hsn-codes` | Create HSN code | Yes | Admin |
| PUT | `/api/admin/hsn-codes/[id]` | Update HSN code | Yes | Admin |
| DELETE | `/api/admin/hsn-codes/[id]` | Delete HSN code | Yes | Admin |

### Orders

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/orders` | List orders | Yes | Admin/Staff |
| GET | `/api/admin/orders/[id]` | Get order details | Yes | Admin/Staff |
| PATCH | `/api/admin/orders/[id]/status` | Update status | Yes | Admin/Staff |
| PATCH | `/api/admin/orders/[id]/confirm` | Confirm order | Yes | Admin/Staff |
| PATCH | `/api/admin/orders/[id]/process` | Process order | Yes | Admin/Staff |
| PATCH | `/api/admin/orders/[id]/pack` | Pack order | Yes | Admin/Staff |
| PATCH | `/api/admin/orders/[id]/cancel` | Cancel order | Yes | Admin/Staff |
| PATCH | `/api/admin/orders/[id]/return` | Process return | Yes | Admin/Staff |

### Customers

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/customers` | List customers | Yes | Admin/Staff |
| GET | `/api/admin/customers/[id]` | Get customer details | Yes | Admin/Staff |

### Users

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/users/customers` | List customer users | Yes | Admin/Staff |
| GET | `/api/admin/users/staff` | List staff users | Yes | Admin |

### Staff

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/staff` | List staff | Yes | Admin |
| POST | `/api/admin/staff` | Create staff | Yes | Admin |
| PUT | `/api/admin/staff/[id]` | Update staff | Yes | Admin |
| DELETE | `/api/admin/staff/[id]` | Delete staff | Yes | Admin |
| GET | `/api/admin/staff/profile` | Get staff profile | Yes | Admin |
| PUT | `/api/admin/staff/profile` | Update staff profile | Yes | Admin |
| GET | `/api/admin/staff/deliveries` | Get staff deliveries | Yes | Admin |

### Roles

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/roles` | List roles | Yes | Admin |
| POST | `/api/admin/roles` | Create role | Yes | Admin |
| PUT | `/api/admin/roles/[id]` | Update role | Yes | Admin |
| DELETE | `/api/admin/roles/[id]` | Delete role | Yes | Admin |

### Permissions

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/permissions` | List permissions | Yes | Admin |
| POST | `/api/admin/permissions` | Create permission | Yes | Admin |
| PUT | `/api/admin/permissions/[id]` | Update permission | Yes | Admin |
| DELETE | `/api/admin/permissions/[id]` | Delete permission | Yes | Admin |

### Coupons

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/coupons` | List coupons | Yes | Admin |
| POST | `/api/admin/coupons` | Create coupon | Yes | Admin |
| PUT | `/api/admin/coupons/[id]` | Update coupon | Yes | Admin |
| DELETE | `/api/admin/coupons/[id]` | Delete coupon | Yes | Admin |

### Offers

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/offers` | List offers | Yes | Admin |
| POST | `/api/admin/offers` | Create offer | Yes | Admin |
| PUT | `/api/admin/offers/[id]` | Update offer | Yes | Admin |
| DELETE | `/api/admin/offers/[id]` | Delete offer | Yes | Admin |

### Banners

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/banners` | List banners | Yes | Admin/Staff |
| POST | `/api/admin/banners` | Create banner | Yes | Admin |
| PUT | `/api/admin/banners/[id]` | Update banner | Yes | Admin |
| DELETE | `/api/admin/banners/[id]` | Delete banner | Yes | Admin |
| GET | `/api/admin/banner-positions` | List banner positions | Yes | Admin/Staff |

### Reviews

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/reviews` | List reviews | Yes | Admin |
| GET | `/api/admin/reviews/[id]` | Get review details | Yes | Admin |
| PUT | `/api/admin/reviews/[id]` | Update review status | Yes | Admin |
| DELETE | `/api/admin/reviews/[id]` | Delete review | Yes | Admin |

### Returns

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/returns` | List returns | Yes | Admin |
| GET | `/api/admin/returns/[id]` | Get return details | Yes | Admin |
| PATCH | `/api/admin/returns/[id]/approve` | Approve return | Yes | Admin |
| PATCH | `/api/admin/returns/[id]/reject` | Reject return | Yes | Admin |

### Blogs

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/blogs` | List blogs | Yes | Admin/Staff |
| POST | `/api/admin/blogs` | Create blog | Yes | Admin |
| PUT | `/api/admin/blogs/[id]` | Update blog | Yes | Admin |
| DELETE | `/api/admin/blogs/[id]` | Delete blog | Yes | Admin |

### FAQs

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/faqs` | List FAQs | Yes | Admin/Staff |
| POST | `/api/admin/faqs` | Create FAQ | Yes | Admin |
| PUT | `/api/admin/faqs/[id]` | Update FAQ | Yes | Admin |
| DELETE | `/api/admin/faqs/[id]` | Delete FAQ | Yes | Admin |

### Delivery

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/delivery/partners` | List delivery partners | Yes | Admin |
| POST | `/api/admin/delivery/partners` | Create delivery partner | Yes | Admin |
| PUT | `/api/admin/delivery/partners/[id]` | Update delivery partner | Yes | Admin |
| DELETE | `/api/admin/delivery/partners/[id]` | Delete delivery partner | Yes | Admin |
| GET | `/api/admin/delivery/slots` | List delivery slots | Yes | Admin |
| POST | `/api/admin/delivery/slots` | Create delivery slot | Yes | Admin |
| PUT | `/api/admin/delivery/slots/[id]` | Update delivery slot | Yes | Admin |
| DELETE | `/api/admin/delivery/slots/[id]` | Delete delivery slot | Yes | Admin |

### Contact Messages

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/contact-messages` | List contacts | Yes | Admin |
| PUT | `/api/admin/contact-messages/[id]` | Update contact status | Yes | Admin |
| DELETE | `/api/admin/contact-messages/[id]` | Delete contact | Yes | Admin |

### Bulk Orders

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/bulk-orders` | List bulk orders | Yes | Admin |
| PUT | `/api/admin/bulk-orders/[id]` | Update bulk order status | Yes | Admin |

### Company

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/company` | Get company info | Yes | Admin |
| PUT | `/api/admin/company` | Update company info | Yes | Admin |

### Upload

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| POST | `/api/admin/upload/upload` | Upload file | Yes | Admin/Staff |

### WhatsApp

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| POST | `/api/admin/whatsapp/connect` | Connect WhatsApp | Yes | Admin |
| POST | `/api/admin/whatsapp/send` | Send message | Yes | Admin |
| GET | `/api/admin/whatsapp/campaigns` | List campaigns | Yes | Admin |
| POST | `/api/admin/whatsapp/campaigns` | Create campaign | Yes | Admin |
| GET | `/api/admin/whatsapp/templates` | List templates | Yes | Admin |
| POST | `/api/admin/whatsapp/templates` | Create template | Yes | Admin |
| GET | `/api/admin/whatsapp/status` | Get status | Yes | Admin |
| GET | `/api/admin/whatsapp/reports` | Get reports | Yes | Admin |

### Settings

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/admin/settings` | Get settings | Yes | Admin |
| PUT | `/api/admin/settings` | Update settings | Yes | Admin |

### Dashboard

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/dashboard/stats` | Get dashboard stats | Yes | Admin/Staff |

### Database

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| POST | `/api/admin/reset-database` | Reset database | Yes | Admin |

---

## 5.4 Top-Level APIs

| Method | Endpoint | Purpose | Auth | Role |
|---|---|---|---|---|
| GET | `/api/addresses` | List addresses | Yes | Any |
| POST | `/api/addresses` | Create address | Yes | Any |
| GET | `/api/blogs` | List blogs | No | - |
| GET | `/api/blogs/[slug]` | Get blog | No | - |
| GET | `/api/brands` | List brands | No | - |
| GET | `/api/cart` | Get cart | Yes | Any |
| POST | `/api/cart` | Add to cart | Yes | Any |
| GET | `/api/categories` | List categories | No | - |
| POST | `/api/checkout/summary` | Checkout summary | Yes | Any |
| POST | `/api/contact` | Submit contact | No | - |
| GET | `/api/coupons` | List coupons | No | - |
| GET | `/api/coupons/[code]` | Validate coupon | Yes | Any |
| GET | `/api/faqs` | List FAQs | No | - |
| GET | `/api/inventory` | List inventory | Yes | Admin/Staff |
| POST | `/api/inventory/adjust` | Adjust stock | Yes | Admin/Staff |
| GET | `/api/inventory/low-stock` | Low stock items | Yes | Admin/Staff |
| GET | `/api/offers` | List offers | No | - |
| GET | `/api/offers/applicable` | Applicable offers | No | - |
| GET | `/api/orders` | List orders | Yes | Any |
| GET | `/api/orders/[id]` | Get order | Yes | Any |
| GET | `/api/orders/number/[orderNumber]` | Get by number | Yes | Any |
| POST | `/api/payment/initiate-redirect` | Initiate payment | Yes | Any |
| GET | `/api/payment/token-info` | Token info | Yes | Any |
| POST | `/api/payment/verify-redirect` | Verify payment | Yes | Any |
| GET | `/api/permissions` | List permissions | Yes | Admin |
| GET | `/api/product-variants` | List variants | No | - |
| GET | `/api/products` | List products | No | - |
| GET | `/api/products/[id]` | Get product | No | - |
| GET | `/api/products/[id]/related` | Related products | No | - |
| GET | `/api/products/[id]/reviews` | Product reviews | No | - |
| GET | `/api/roles` | List roles | Yes | Admin |
| GET | `/api/staff` | List staff | Yes | Admin |
| GET | `/api/users` | List users | Yes | Admin |
| PUT | `/api/users/password` | Update password | Yes | Any |

---

## 5.5 Page → API → Database Mapping

### Home Page
```
Home (/)
    ↓
[Each component fetches internally]
    ↓
┌─────────────────────────────────────────┐
│  HeroSlider                             │
│  → GET /api/customer/banners            │
│  → banners                              │
├─────────────────────────────────────────┤
│  CategorySection                        │
│  → GET /api/customer/categories         │
│  → ProductCategory                      │
├─────────────────────────────────────────┤
│  ProductSection                         │
│  → GET /api/customer/products           │
│  → Product, ProductVariant              │
├─────────────────────────────────────────┤
│  Banner                                 │
│  → GET /api/customer/banners            │
│  → Banner                               │
├─────────────────────────────────────────┤
│  OfferReels                             │
│  → GET /api/offers/applicable           │
│  → Offer, offer_products                │
└─────────────────────────────────────────┘
```

### Product Listing Page
```
Products (/products)
    ↓
┌─────────────────────────────────────────┐
│  FilterSidebar                          │
│  → useCustomerCategories()              │
│  → GET /api/customer/categories         │
│  → ProductCategory                      │
├─────────────────────────────────────────┤
│  CustomerProductGrid                    │
│  → useCustomerGlobalVariants()          │
│  → POST /api/customer/variants          │
│  → Product, ProductVariant,             │
│    VariantUnitPrice, Inventory,         │
│    ProductImage, ProductCategory,       │
│    ProductBrand                         │
└─────────────────────────────────────────┘
```

### Product Detail Page
```
Product Detail (/products/[slug])
    ↓
┌─────────────────────────────────────────┐
│  useCustomerProduct(slug)               │
│  → GET /api/customer/products/[slug]    │
│  → Product                              │
│    → ProductVariant[]                   │
│    → VariantUnitPrice[]                 │
│    → ProductImage[]                     │
│    → ProductCategory                    │
│    → ProductBrand                       │
│    → Inventory[]                        │
│    → Review[]                           │
│      → ReviewImage[]                    │
│      → User                             │
└─────────────────────────────────────────┘
```

### Cart Page
```
Cart (/cart)
    ↓
┌─────────────────────────────────────────┐
│  useCustomerCart()                      │
│  → GET /api/customer/cart               │
│  → Cart                                 │
│    → CartItem[]                         │
│      → ProductVariant                   │
│        → Product                        │
│          → ProductImage[]               │
│        → VariantUnitPrice               │
│        → Inventory                      │
├─────────────────────────────────────────┤
│  useUpdateCartQuantityMutation()        │
│  → PATCH /api/customer/cart/items/[id]  │
│  → CartItem (update quantity)           │
├─────────────────────────────────────────┤
│  useRemoveCartItemMutation()            │
│  → DELETE /api/customer/cart/items/[id] │
│  → CartItem (delete)                    │
├─────────────────────────────────────────┤
│  useClearCartMutation()                 │
│  → DELETE /api/customer/cart            │
│  → CartItem[] (delete all)              │
└─────────────────────────────────────────┘
```

### Checkout Page
```
Checkout (/checkout)
    ↓
┌─────────────────────────────────────────┐
│  useCustomerCart()                      │
│  → GET /api/customer/cart               │
│  → Cart, CartItem[]                     │
├─────────────────────────────────────────┤
│  useCustomerAddresses()                 │
│  → GET /api/customer/addresses          │
│  → CustomerAddress[]                    │
├─────────────────────────────────────────┤
│  useCreateCustomerAddress()             │
│  → POST /api/customer/addresses         │
│  → CustomerAddress                      │
├─────────────────────────────────────────┤
│  useCreateCustomerOrder()               │
│  → POST /api/customer/orders            │
│  → Order, OrderItem[]                   │
│  → Inventory (reserve)                  │
├─────────────────────────────────────────┤
│  customerPaymentApi.initiateRedirectPayment() │
│  → POST /api/customer/payment/create-order   │
│  → Payment (Razorpay order)            │
├─────────────────────────────────────────┤
│  customerPaymentApi.verifyPayment()     │
│  → POST /api/customer/payment/verify    │
│  → Payment (verify signature)           │
│  → Order (confirm)                      │
│  → Inventory (deduct)                   │
└─────────────────────────────────────────┘
```

### Orders List Page
```
Orders (/orders)
    ↓
┌─────────────────────────────────────────┐
│  useCustomerOrders({ page, status, search }) │
│  → GET /api/customer/orders             │
│  → Order[]                              │
│    → OrderItem[]                        │
│      → ProductVariant                   │
│        → Product                        │
│    → Payment                            │
└─────────────────────────────────────────┘
```

### Order Detail Page
```
Order Detail (/orders/[id])
    ↓
┌─────────────────────────────────────────┐
│  useCustomerOrderDetail(id)             │
│  → GET /api/customer/orders/[id]        │
│  → Order                                │
│    → OrderItem[]                        │
│      → ProductVariant                   │
│        → Product                        │
│          → ProductImage[]               │
│    → OrderAddress                       │
│    → Payment                            │
│    → order_status_history[]             │
├─────────────────────────────────────────┤
│  useCancelCustomerOrder()               │
│  → PATCH /api/customer/orders/[id]/cancel │
│  → Order (status → cancelled)           │
│  → Inventory (restore)                  │
│  → Payment (refund if prepaid)          │
└─────────────────────────────────────────┘
```

### Wishlist Page
```
Wishlist (/wishlist)
    ↓
┌─────────────────────────────────────────┐
│  useCustomerWishlist()                  │
│  → GET /api/customer/wishlist           │
│  → WishlistItem[]                       │
│    → ProductVariant                     │
│      → Product                          │
│        → ProductImage[]                 │
│      → VariantUnitPrice                 │
│      → Inventory                        │
├─────────────────────────────────────────┤
│  useRemoveCustomerWishlist()            │
│  → DELETE /api/customer/wishlist/[id]   │
│  → WishlistItem (delete)                │
├─────────────────────────────────────────┤
│  useMoveCustomerWishlistToCart()        │
│  → POST /api/customer/wishlist/[id]/move-to-cart │
│  → WishlistItem (delete)                │
│  → CartItem (create)                    │
└─────────────────────────────────────────┘
```

### Profile Page
```
Profile (/profile)
    ↓
┌─────────────────────────────────────────┐
│  AccountShell                           │
│  → Dashboard Tab                        │
│    → GET /api/customer/profile          │
│    → User                               │
│  → Orders Tab                           │
│    → GET /api/customer/orders           │
│    → Order[]                            │
│  → Addresses Tab                        │
│    → GET /api/customer/addresses        │
│    → CustomerAddress[]                  │
│  → Wishlist Tab                         │
│    → GET /api/customer/wishlist         │
│    → WishlistItem[]                     │
│  → Settings Tab                         │
│    → GET /api/customer/profile          │
│    → PUT /api/customer/profile          │
└─────────────────────────────────────────┘
```

### Admin Dashboard
```
Admin Dashboard (/admin/dashboard)
    ↓
┌─────────────────────────────────────────┐
│  useDashboardStats()                    │
│  → GET /api/dashboard/stats             │
│  → Product (count)                      │
│  → ProductCategory (count)              │
│  → User (count, role=CUSTOMER)          │
│  → Order (count, revenue)               │
│  → Inventory (low stock count)          │
├─────────────────────────────────────────┤
│  SalesChart (DUMMY DATA)                │
├─────────────────────────────────────────┤
│  RecentOrders (DUMMY DATA)              │
├─────────────────────────────────────────┤
│  TopProducts (DUMMY DATA)               │
├─────────────────────────────────────────┤
│  LowStockAlerts (DUMMY DATA)            │
└─────────────────────────────────────────┘
```

### Admin Products
```
Admin Products (/admin/dashboard/products)
    ↓
┌─────────────────────────────────────────┐
│  useProducts()                          │
│  → GET /api/admin/products              │
│  → Product[]                            │
│    → ProductCategory                    │
│    → ProductBrand                       │
│    → ProductVariant[]                   │
│    → Inventory[]                        │
├─────────────────────────────────────────┤
│  useProductMutations()                  │
│  → POST /api/admin/products             │
│  → PUT /api/admin/products/[id]         │
│  → DELETE /api/admin/products/[id]      │
└─────────────────────────────────────────┘
```

### Admin Orders
```
Admin Orders (/admin/dashboard/orders)
    ↓
┌─────────────────────────────────────────┐
│  useAdminOrders()                       │
│  → GET /api/admin/orders                │
│  → Order[]                              │
│    → OrderItem[]                        │
│    → User (customer)                    │
│    → Payment                            │
├─────────────────────────────────────────┤
│  useUpdateOrderStatus()                 │
│  → PATCH /api/admin/orders/[id]/status  │
│  → Order (update status)                │
│  → order_status_history (create)        │
└─────────────────────────────────────────┘
```

---

## 5.6 API Inventory Summary

| Category | Count | Status |
|---|---|---|
| Auth APIs | 12 | ✅ Complete |
| Customer APIs | 40 | ✅ Complete |
| Admin APIs | 101 | ✅ Complete |
| Top-level APIs | ~58 | ✅ Complete |
| **Total** | **~211** | - |

### API Gaps Identified
- ⚠️ Dashboard stats API exists but dashboard uses dummy data for charts
- ⚠️ Stock reservation API may be incomplete
- ⚠️ Shipment tracking API may be incomplete
- ⚠️ Return request API may need enhancement
- ❓ No bulk product import/export API
- ❓ No scheduled offer API
- ❓ No customer group API
- ❓ No automated stock alert API
- ❓ No invoice generation API
- ❓ No shipping label generation API