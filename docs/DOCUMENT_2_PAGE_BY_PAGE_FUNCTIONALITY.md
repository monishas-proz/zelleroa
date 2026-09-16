# Document 2 — Page-by-Page Functionality

## Table of Contents
1. [Storefront Pages](#storefront-pages)
2. [Auth Pages](#auth-pages)
3. [Admin Pages](#admin-pages)

---

## Storefront Pages

---

### 1. Home Page

| Attribute | Value |
|---|---|
| **Route** | `/` |
| **Purpose** | Main customer landing page |
| **User** | Customer |
| **Type** | Server Component |

#### UI Sections
- `OfferPopup` (modal overlay)
- `HeroSlider` (image carousel)
- `CategorySection`
- `ProductSection`
- `Banner`
- `OfferReels`
- `Pledge`
- `Tradition`
- `Features`
- `Feedback`

#### Entry Points
- Direct URL `/`
- After login redirect

#### User Actions
- Browse featured categories
- View promotional banners
- Click category → Category listing
- Click product → Product detail

#### API
- No direct API calls (each child component fetches internally)

#### Database
- `Banner`, `Product`, `ProductCategory`, `Offer`

#### Existing vs Required
- ✅ Existing: Basic home page with sections
- ⚠️ Needs modification: Connect to real data (some components may use dummy data)
- ❓ New: Recently viewed products, recommended products

---

### 2. Products Listing

| Attribute | Value |
|---|---|
| **Route** | `/products` |
| **Purpose** | Full product catalog with filtering and sorting |
| **User** | Customer |
| **Type** | Client Component |

#### UI Sections
- Hero/header banner with breadcrumb
- Mobile filter toggle bar
- Two-column layout: `FilterSidebar` + `CustomerProductGrid`
- Infinite scroll sentinel
- "All items viewed" footer message

#### Entry Points
- Home → Products
- Category → Products
- Search → Products
- Header nav

#### User Actions
- Filter by category, price, brand, color, size
- Sort by price, popularity, rating
- Search products
- Select product → Product detail
- Add to wishlist
- Add to cart

#### API
- `POST /api/customer/variants` (paginated variant list)
- `GET /api/customer/categories`

#### Database
- `Product`, `ProductVariant`, `ProductCategory`, `ProductBrand`, `Inventory`

#### Validation
- Filter parameters validated via Zod
- Pagination validated (page, pageSize)

#### Loading State
- Initial: 12-card `ProductCatalogSkeleton`
- Page 2+: 4 shimmer cards + "Loading more items..."

#### Error State
- "Unable to load items" with retry button

#### Empty State
- "No products found" with reset filters option

#### Existing vs Required
- ✅ Existing: Full product listing with filters, sort, infinite scroll
- ⚠️ Needs modification: Ensure all filters work correctly
- ❓ New: Product comparison, size chart for fashion

---

### 3. Product Detail

| Attribute | Value |
|---|---|
| **Route** | `/products/[slug]` |
| **Purpose** | Single product detail page |
| **User** | Customer |
| **Type** | Client Component |

#### UI Sections
- `Breadcrumb` (Products > Category > Product)
- `ProductDetails` (gallery, title, description, variants, CTA)
- Product images gallery
- Variant selector (color, size, etc.)
- Price display (MRP, discount, selling price)
- Add to cart button
- Add to wishlist button
- Product specifications
- Reviews section
- Related products

#### Entry Points
- Products listing → Product detail
- Category listing → Product detail
- Search results → Product detail

#### User Actions
- Select variant (color, size, etc.)
- Add to cart
- Add to wishlist
- View reviews
- View related products

#### API
- `GET /api/customer/products/[slug]` or `GET /api/customer/variants/[id]`

#### Database
- `Product`, `ProductVariant`, `VariantUnitPrice`, `ProductImage`, `Inventory`, `Review`

#### Business Logic
```
Select Color → Find matching variant → Update images → Update price → Update stock → Update available sizes
```

#### Loading State
- `ProductDetailSkeleton` with gallery + details shimmer

#### Error State
- `ErrorState` "Failed to load product" with retry
- "Product not found" for null product

#### Existing vs Required
- ✅ Existing: Basic product detail with variant selection
- ⚠️ Needs modification: Multi-attribute variant support for different categories
- ❓ New: Frequently bought together, size chart, product comparison

---

### 4. Cart

| Attribute | Value |
|---|---|
| **Route** | `/cart` |
| **Purpose** | Shopping cart management |
| **User** | Customer (authenticated) |
| **Type** | Client Component |

#### UI Sections
- Header bar with item count badge
- "Add More Items" link
- "Clear Cart" button
- Two-column layout: `CartItem` list + `CartSummary` sidebar
- Empty cart state

#### Entry Points
- Product detail → Add to cart
- Wishlist → Move to cart
- Header cart icon

#### User Actions
- View cart items
- Update quantity
- Remove item
- Clear cart
- Proceed to checkout
- Continue shopping

#### API
- `GET /api/customer/cart` (fetch cart)
- `PATCH /api/customer/cart/items/[id]` (update quantity)
- `DELETE /api/customer/cart/items/[id]` (remove item)
- `DELETE /api/customer/cart` (clear cart)

#### Database
- `Cart`, `CartItem`, `ProductVariant`, `Inventory`

#### Business Logic
```
Add to cart → Check stock → Add item → Update quantity → Calculate subtotal
```
- Backend recalculates prices (frontend NOT trusted for price/discount/total)
- Free shipping if subtotal >= 500, else ₹40

#### Validation
- Quantity must be >= 1
- Stock availability checked

#### Loading State
- `CartPageSkeleton` with shimmer cards

#### Error State
- "Unable to Load Cart" with retry

#### Empty State
- "Your Cart is Empty" with "Back to Collections" link

#### Permissions
- Requires authentication

#### Existing vs Required
- ✅ Existing: Full cart functionality
- ⚠️ Needs modification: Stock reservation during checkout
- ❓ New: Save for later, quantity suggestions

---

### 5. Checkout

| Attribute | Value |
|---|---|
| **Route** | `/checkout` |
| **Purpose** | Unified single-page checkout flow |
| **User** | Customer (authenticated) |
| **Type** | Client Component |

#### UI Sections
- Header with breadcrumb + SSL badge
- Checkout error banner
- Step 1: Delivery Address (address list + inline add form)
- Step 2: Shipping & Delivery Method (standard/express)
- Step 3: Payment Method (Razorpay/COD)
- Step 4: Special Delivery Instructions
- Right sidebar: Order Summary with price breakdown

#### Entry Points
- Cart → Checkout

#### User Actions
- Select/create delivery address
- Choose shipping method
- Select payment method
- Apply coupon
- Place order
- Pay via Razorpay

#### API
- `GET /api/customer/cart`
- `GET /api/customer/addresses`
- `POST /api/customer/addresses`
- `POST /api/customer/orders` (COD)
- `POST /api/customer/payment/create-order` (Razorpay)
- `POST /api/customer/payment/verify`

#### Database
- `Cart`, `CartItem`, `CustomerAddress`, `Order`, `OrderItem`, `Payment`, `Inventory`

#### Business Logic
```
Cart → Address → Shipping → Payment → Create Order → Reserve Stock → Payment → Confirm Order
```

#### Validation
- Address: name, phone, address, city, PIN required
- Payment method selection required
- Cart must not be empty

#### Loading State
- `CheckoutSkeleton` with shimmer

#### Error State
- Red banner with error message
- "Your Cart is Empty" with "Browse Collections" CTA

#### Empty State
- Empty cart redirect

#### Permissions
- Requires authentication

#### Existing vs Required
- ✅ Existing: Full checkout with Razorpay + COD
- ⚠️ Needs modification: Stock reservation, coupon validation
- ❓ New: Guest checkout, express checkout

#### Sub-pages

| Sub-page | Route | Purpose | Status |
|---|---|---|---|
| `checkout/address` | `/checkout/address` | Address management | ✅ Existing |
| `checkout/payment` | `/checkout/payment` | Payment step | ✅ Existing |
| `checkout/success` | `/checkout/success` | Order confirmation | ✅ Existing |

---

### 6. Wishlist

| Attribute | Value |
|---|---|
| **Route** | `/wishlist` |
| **Purpose** | View and manage saved products |
| **User** | Customer (authenticated) |
| **Type** | Client Component |

#### UI Sections
- Header with item count + "Continue Shopping"
- `WishlistGrid` with saved items
- Empty state
- Guest prompt state

#### Entry Points
- Product detail → Add to wishlist
- Header wishlist icon

#### User Actions
- View wishlist items
- Remove from wishlist
- Move to cart
- Continue shopping

#### API
- `GET /api/customer/wishlist`
- `DELETE /api/customer/wishlist/[id]`
- `POST /api/customer/wishlist/[id]/move-to-cart`

#### Database
- `WishlistItem`, `ProductVariant`, `Cart`, `CartItem`

#### Business Logic
```
Add to wishlist → Save product/variant → Wishlist page → Add to cart
```

#### Validation
- Duplicate handling (prevent adding same item twice)
- Stock check for out-of-stock items

#### Loading State
- `WishlistSkeleton` with 8 shimmer cards

#### Error State
- "Unable to Load Wishlist" with retry

#### Empty State
- "Your Wishlist is Empty" with "Explore Collections" CTA

#### Permissions
- Requires authentication

#### Existing vs Required
- ✅ Existing: Full wishlist functionality
- ⚠️ Needs modification: Out-of-stock handling
- ❓ New: Share wishlist, wishlist notifications

---

### 7. Orders List

| Attribute | Value |
|---|---|
| **Route** | `/orders` |
| **Purpose** | Paginated order history |
| **User** | Customer (authenticated) |
| **Type** | Client Component |

#### UI Sections
- Success banner (after placing order)
- Header with order count badge
- Search input + status filter dropdown
- `OrderCard` list
- Pagination controls

#### Entry Points
- Profile → Orders
- Checkout success → Orders
- Header account menu

#### User Actions
- View order list
- Search by order number
- Filter by status
- Select order → Order detail
- Continue shopping

#### API
- `GET /api/customer/orders` (paginated, filterable)

#### Database
- `Order`, `OrderItem`, `Payment`

#### Validation
- Status filter validated against enum values

#### Loading State
- `OrdersPageSkeleton` + `OrdersListSkeleton`

#### Error State
- Red error card with retry

#### Empty State
- "No orders found" with contextual message

#### Permissions
- Requires authentication

#### Existing vs Required
- ✅ Existing: Full order list with search/filter
- ⚠️ Needs modification: None significant
- ❓ New: Download invoice, reorder

---

### 8. Order Detail

| Attribute | Value |
|---|---|
| **Route** | `/orders/[id]` |
| **Purpose** | View full details of a single order |
| **User** | Customer (authenticated) |
| **Type** | Client Component |

#### UI Sections
- Back navigation + breadcrumb
- `OrderDetailView` (status timeline, items, address, payment)
- Cancel order button (for pending/confirmed)

#### Entry Points
- Orders list → Order detail

#### User Actions
- View order status timeline
- View order items
- View shipping address
- View payment info
- Cancel order (if pending/confirmed)

#### API
- `GET /api/customer/orders/[id]`
- `PATCH /api/customer/orders/[id]/cancel`

#### Database
- `Order`, `OrderItem`, `OrderAddress`, `order_status_history`, `Payment`

#### Business Logic
```
Order Status:
PLACED → Cancel
CONFIRMED → Cancel
PROCESSING → (no cancel)
PACKED → (no cancel)
SHIPPED → Track
DELIVERED → Return / Review
CANCELLED → (terminal)
RETURNED → (terminal)
```

#### Loading State
- `OrderDetailSkeleton` with shimmer

#### Error State
- "Order Not Found" with navigation buttons

#### Permissions
- Requires authentication

#### Existing vs Required
- ✅ Existing: Order detail with cancel
- ⚠️ Needs modification: Return request flow
- ❓ New: Track order (shipment tracking), return request

---

### 9. Profile

| Attribute | Value |
|---|---|
| **Route** | `/profile?tab=<tabName>` |
| **Purpose** | Customer account dashboard |
| **User** | Customer (authenticated) |
| **Type** | Client Component |

#### UI Sections
- Top banner
- Sidebar navigation with avatar + tab list
- Content area for active tab

#### Entry Points
- Header account menu
- After login redirect

#### User Actions
- View dashboard
- Manage orders
- Manage addresses
- Manage wishlist
- Edit settings

#### API
- Delegated to `AccountShell` per tab

#### Database
- `User`, `CustomerAddress`, `Order`, `WishlistItem`

#### Loading State
- `AccountPageSkeleton` with shimmer

#### Permissions
- Requires authentication

#### Tabs Available
- Dashboard
- Orders
- Addresses
- Wishlist
- Settings

#### Existing vs Required
- ✅ Existing: Tab-based account management
- ⚠️ Needs modification: None significant
- ❓ New: Notification preferences, reward points

---

### 10. Categories

| Attribute | Value |
|---|---|
| **Route** | `/categories` |
| **Purpose** | Redirect to `/categories/all` |
| **Type** | Server Component |

#### Behavior
- Instant redirect to `/categories/all`

---

### 11. Category Products

| Attribute | Value |
|---|---|
| **Route** | `/categories/[slug]` |
| **Purpose** | Category-scoped product listing |
| **User** | Customer |
| **Type** | Client Component |

#### UI Sections
- Hero/header banner with breadcrumb
- Mobile filter toggle bar
- `FilterSidebar` (locked to single category mode)
- `CustomerProductGrid`
- Infinite scroll sentinel

#### Entry Points
- Home → Category
- Categories page → Category
- Header nav → Category

#### User Actions
- View category products
- Filter within category
- Sort products
- Select product → Product detail

#### API
- `POST /api/customer/variants` (filtered by category)
- `GET /api/customer/categories`

#### Database
- `Product`, `ProductVariant`, `ProductCategory`, `Inventory`

#### Loading State
- 12-card `ProductCatalogSkeleton`

#### Error State
- "Unable to load items" with retry

#### Empty State
- "No products found" with reset filters

#### Existing vs Required
- ✅ Existing: Category-scoped listing with filters
- ⚠️ Needs modification: None significant
- ❓ New: Subcategory navigation, breadcrumbs

---

## Auth Pages

---

### 12. Login

| Attribute | Value |
|---|---|
| **Route** | `/login` |
| **Purpose** | User authentication |
| **User** | Customer |
| **Type** | Client Component |

#### UI Sections
- Auth banner
- Login form (email/password)
- Forgot password link
- Register link

#### Flow
```
Enter Email/Password → Validate → Authenticate → Check Role → Redirect
```

#### API
- `POST /api/auth/login`

#### Database
- `User`, `user_sessions`

#### Validation
- Email format
- Password required

#### Existing vs Required
- ✅ Existing: Full login functionality
- ⚠️ Needs modification: None
- ❓ New: Social login, remember me

---

### 13. Register

| Attribute | Value |
|---|---|
| **Route** | `/register` |
| **Purpose** | New user registration |
| **User** | Customer |
| **Type** | Client Component |

#### UI Sections
- Auth banner
- Registration form (name, email, phone, password)
- OTP verification step
- Login link

#### Flow
```
Enter Details → Validate → Create Account → OTP Verification → Account Activated → Login
```

#### API
- `POST /api/auth/register`
- `POST /api/auth/verify-registration-otp`
- `POST /api/auth/resend-register-otp`

#### Database
- `User`, `otp_verifications`

#### Validation
- Name required
- Email format
- Phone format
- Password strength

#### Existing vs Required
- ✅ Existing: Full registration with OTP
- ⚠️ Needs modification: None
- ❓ New: Terms acceptance checkbox

---

### 14. Forgot Password

| Attribute | Value |
|---|---|
| **Route** | `/forgot-password` |
| **Purpose** | Password reset flow |
| **User** | Customer |
| **Type** | Client Component |

#### Flow
```
Enter Email → Send OTP → Verify OTP → Reset Password → Success
```

#### API
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-forgot-password-otp`
- `POST /api/auth/reset-password`

#### Database
- `User`, `otp_verifications`

#### Existing vs Required
- ✅ Existing: Full forgot password flow
- ⚠️ Needs modification: None
- ❓ New: None

---

## Admin Pages

---

### 15. Admin Dashboard

| Attribute | Value |
|---|---|
| **Route** | `/admin/dashboard` |
| **Purpose** | Admin overview and analytics |
| **User** | Admin/Staff |
| **Type** | Client Component |

#### UI Sections
- Welcome header with admin name
- 8 StatsCards:
  - Total Products
  - Total Categories
  - Total Customers
  - Total Orders
  - Revenue
  - Pending Orders
  - Low Stock
  - Today's Orders
- Sales chart (weekly)
- Recent orders table
- Top products table
- Low stock alerts

#### API
- `GET /api/dashboard/stats` (for stats cards)

#### Database
- `Product`, `ProductCategory`, `User`, `Order`, `Inventory`

#### Loading State
- `AdminTableSkeleton` with stats

#### Error State
- `ErrorState` with retry

#### Existing vs Required
- ✅ Existing: Basic dashboard with stats
- ⚠️ Needs modification: Sales chart, recent orders, top products use DUMMY DATA
- ❓ New: Real-time data, date range filter, export

**IMPORTANT FINDING:** Dashboard uses dummy data for:
- Sales chart
- Recent orders
- Top products
- Low stock alerts

Only stats cards are connected to real API.

---

### 16. Admin Products

| Attribute | Value |
|---|---|
| **Route** | `/admin/dashboard/products` |
| **Purpose** | Product management |
| **User** | Admin/Staff |
| **Type** | Client Component |

#### UI Sections
- Page header with "Add Product" button
- Search/filter bar
- Products table with columns:
  - Image
  - Name
  - Category
  - Brand
  - Price
  - Stock
  - Status
  - Actions
- Pagination

#### User Actions
- View products
- Search/filter products
- Create new product
- Edit product
- Delete product
- Toggle status

#### API
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/[id]`
- `DELETE /api/admin/products/[id]`

#### Database
- `Product`, `ProductVariant`, `ProductImage`, `ProductCategory`, `ProductBrand`

#### Existing vs Required
- ✅ Existing: Full CRUD with table view
- ⚠️ Needs modification: Variant management integration
- ❓ New: Bulk actions, import/export

---

### 17. Admin Product Detail

| Attribute | Value |
|---|---|
| **Route** | `/admin/dashboard/products/[id]` |
| **Purpose** | Edit single product |
| **User** | Admin/Staff |
| **Type** | Client Component |

#### UI Sections
- Product form with tabs:
  - Basic Details
  - Images
  - Variants
  - Attributes
  - SEO
  - Pricing

#### User Actions
- Edit product details
- Manage images
- Manage variants
- Set pricing
- Update SEO

#### API
- `GET /api/admin/products/[id]`
- `PUT /api/admin/products/[id]`
- `POST /api/admin/products/[id]/images`
- `DELETE /api/admin/products/[id]/images/[imageId]`

#### Database
- `Product`, `ProductVariant`, `ProductImage`, `VariantUnitPrice`

#### Existing vs Required
- ✅ Existing: Full product edit form
- ⚠️ Needs modification: Multi-attribute variant support
- ❓ New: Bulk variant editing

---

### 18. Admin Categories

| Attribute | Value |
|---|---|
| **Route** | `/admin/dashboard/categories` |
| **Purpose** | Category management |
| **User** | Admin/Staff |
| **Type** | Client Component |

#### UI Sections
- Page header with "Add Category" button
- Categories table
- Category form modal

#### User Actions
- View categories
- Create category
- Edit category
- Delete category
- Reorder categories

#### API
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/[id]`
- `DELETE /api/admin/categories/[id]`

#### Database
- `ProductCategory`

#### Existing vs Required
- ✅ Existing: Full CRUD
- ⚠️ Needs modification: None
- ❓ New: Category attributes definition

---

### 19. Admin Brands

| Attribute | Value |
|---|---|
| **Route** | `/admin/dashboard/brands` |
| **Purpose** | Brand management |
| **User** | Admin/Staff |
| **Type** | Client Component |

#### UI Sections
- Page header with "Add Brand" button
- Brands table
- Brand form modal

#### User Actions
- View brands
- Create brand
- Edit brand
- Delete brand

#### API
- `GET /api/admin/brands`
- `POST /api/admin/brands`
- `PUT /api/admin/brands/[id]`
- `DELETE /api/admin/brands/[id]`

#### Database
- `ProductBrand`

#### Existing vs Required
- ✅ Existing: Full CRUD
- ⚠️ Needs modification: None
- ❓ New: None

---

### 20. Admin Orders

| Attribute | Value |
|---|---|
| **Route** | `/admin/dashboard/orders` |
| **Purpose** | Order management |
| **User** | Admin/Staff |
| **Type** | Client Component |

#### UI Sections
- Page header
- Status tabs (pending/confirmed/processing/packed/shipped/out-for-delivery/delivered/cancelled/returned)
- Orders table with columns:
  - Order ID
  - Customer
  - Date
  - Total
  - Status
  - Actions
- Order detail view

#### User Actions
- View orders
- Filter by status
- View order detail
- Update order status
- Process return requests

#### API
- `GET /api/admin/orders`
- `GET /api/admin/orders/[id]`
- `PATCH /api/admin/orders/[id]/status`
- `PATCH /api/admin/orders/[id]/confirm`
- `PATCH /api/admin/orders/[id]/process`
- `PATCH /api/admin/orders/[id]/pack`
- `PATCH /api/admin/orders/[id]/cancel`
- `PATCH /api/admin/orders/[id]/return`

#### Database
- `Order`, `OrderItem`, `OrderAddress`, `order_status_history`, `Payment`

#### Business Logic
```
Order Status Flow:
pending → confirmed → processing → packed → shipped → out_for_delivery → delivered
                                                          ↓
                                                     cancelled
                                                          ↓
                                                     returned
```

#### Existing vs Required
- ✅ Existing: Full order management with status tabs
- ⚠️ Needs modification: Shipment tracking integration
- ❓ New: Bulk status update, invoice generation

---

### 21. Admin Customers

| Attribute | Value |
|---|---|
| **Route** | `/admin/dashboard/customers` |
| **Purpose** | Customer management |
| **User** | Admin/Staff |
| **Type** | Client Component |

#### UI Sections
- Page header
- Customers table
- Customer detail view

#### User Actions
- View customers
- View customer detail
- View customer orders
- View customer spending

#### API
- `GET /api/admin/customers`
- `GET /api/admin/customers/[id]`

#### Database
- `User`, `Order`, `CustomerAddress`

#### Existing vs Required
- ✅ Existing: Customer list and detail
- ⚠️ Needs modification: None
- ❓ New: Customer export, customer groups

---

### 22. Admin Coupons

| Attribute | Value |
|---|---|
| **Route** | `/admin/dashboard/coupons` |
| **Purpose** | Coupon management |
| **User** | Admin |
| **Type** | Client Component |

#### UI Sections
- Page header with "Add Coupon" button
- Coupons table
- Coupon form modal

#### User Actions
- View coupons
- Create coupon
- Edit coupon
- Delete coupon
- Toggle status

#### API
- `GET /api/admin/coupons`
- `POST /api/admin/coupons`
- `PUT /api/admin/coupons/[id]`
- `DELETE /api/admin/coupons/[id]`

#### Database
- `Coupon`, `coupon_usage`

#### Coupon Fields
- Code
- Discount type (percentage/fixed)
- Discount value
- Minimum order amount
- Maximum discount
- Start date
- End date
- Usage limit
- Per user limit

#### Existing vs Required
- ✅ Existing: Full CRUD
- ⚠️ Needs modification: Category/product restrictions
- ❓ New: Bulk generate, usage analytics

---

### 23. Admin Offers

| Attribute | Value |
|---|---|
| **Route** | `/admin/dashboard/offers` |
| **Purpose** | Offer management |
| **User** | Admin |
| **Type** | Client Component |

#### UI Sections
- Page header with "Add Offer" button
- Offers table
- Offer form modal

#### User Actions
- View offers
- Create offer
- Edit offer
- Delete offer
- Toggle status

#### API
- `GET /api/admin/offers`
- `POST /api/admin/offers`
- `PUT /api/admin/offers/[id]`
- `DELETE /api/admin/offers/[id]`

#### Database
- `Offer`, `offer_products`, `offer_items`

#### Offer Types
- Product offer
- Category offer
- Brand offer
- Festival offer
- Flash sale

#### Existing vs Required
- ✅ Existing: Full CRUD
- ⚠️ Needs modification: Offer priority/stacking rules
- ❓ New: Scheduled offers, offer analytics

---

### 24. Admin Inventory

| Attribute | Value |
|---|---|
| **Route** | `/admin/dashboard/inventory` |
| **Purpose** | Inventory management |
| **User** | Admin/Staff |
| **Type** | Client Component |

#### UI Sections
- Page header
- Inventory table
- Stock adjustment form
- Stock history
- Low stock alerts

#### User Actions
- View inventory
- Adjust stock
- View stock history
- View low stock items

#### API
- `GET /api/inventory`
- `POST /api/inventory/adjust`
- `GET /api/inventory/low-stock`
- `GET /api/inventory/history`

#### Database
- `Inventory`, `InventoryTransaction`, `stock_adjustments`, `stock_reports`

#### Business Logic
```
Stock In → Stock Out → Current Stock → Reserved Stock → Available Stock
```

#### Existing vs Required
- ✅ Existing: Basic inventory management
- ⚠️ Needs modification: Stock reservation during checkout
- ❓ New: Stock alerts, automated reordering

---

### 25. Admin Reviews

| Attribute | Value |
|---|---|
| **Route** | `/admin/dashboard/reviews` |
| **Purpose** | Review moderation |
| **User** | Admin |
| **Type** | Client Component |

#### UI Sections
- Page header
- Reviews table
- Review detail view

#### User Actions
- View reviews
- Approve review
- Reject review
- Delete review

#### API
- `GET /api/admin/reviews`
- `PUT /api/admin/reviews/[id]`
- `DELETE /api/admin/reviews/[id]`

#### Database
- `Review`, `ReviewImage`

#### Existing vs Required
- ✅ Existing: Review moderation
- ⚠️ Needs modification: None
- ❓ New: Review analytics, response to reviews

---

### 26. Admin Settings

| Attribute | Value |
|---|---|
| **Route** | `/admin/dashboard/settings` |
| **Purpose** | Store settings |
| **User** | Admin |
| **Type** | Client Component |

#### UI Sections
- Settings form
- Company info
- Payment settings
- Shipping settings
- Email settings

#### User Actions
- View settings
- Update company info
- Update payment settings
- Update shipping settings

#### API
- `GET /api/admin/settings`
- `PUT /api/admin/settings`

#### Database
- `settings`, `Company`

#### Existing vs Required
- ✅ Existing: Basic settings
- ⚠️ Needs modification: None
- ❓ New: Shipping zones, payment gateways configuration

---

## Cross-cutting Patterns

### Auth Gating
Pages requiring authentication (`cart`, `checkout`, `wishlist`, `orders`, `profile`) all check `useSession()` status and redirect to `/login?callbackUrl=<current>` when unauthenticated.

### Loading Skeletons
Every page defines its own inline `*Skeleton` component with `skeleton-shimmer` class for consistent shimmer effects.

### Error Handling
Consistent pattern: error state card with icon, title, description, and Retry button calling `refetch()`.

### Data Fetching
All client pages use TanStack Query via custom hooks (prefixed `useCustomer*` for storefront, `use*` for admin).

### Theme Consistency
- Older pages use CSS theme variables (`theme-primary`, `theme-surface`)
- Newer pages use hardcoded brand hex values (`#7A2224`, `#F8BE15`, `#E8D9CD`)
- **Needs standardization**

---

## Summary Table

| Page | Route | Status | Key Finding |
|---|---|---|---|
| Home | `/` | ✅ Existing | Sections work, may need real data |
| Products | `/products` | ✅ Existing | Full filtering, infinite scroll |
| Product Detail | `/products/[slug]` | ✅ Existing | Variant selection works |
| Cart | `/cart` | ✅ Existing | Full cart functionality |
| Checkout | `/checkout` | ✅ Existing | Razorpay + COD |
| Wishlist | `/wishlist` | ✅ Existing | Full wishlist |
| Orders | `/orders` | ✅ Existing | List with search/filter |
| Order Detail | `/orders/[id]` | ✅ Existing | Cancel works, return needs work |
| Profile | `/profile` | ✅ Existing | Tab-based account |
| Categories | `/categories/[slug]` | ✅ Existing | Category-scoped listing |
| Login | `/login` | ✅ Existing | Full auth |
| Register | `/register` | ✅ Existing | OTP verification |
| Admin Dashboard | `/admin/dashboard` | ⚠️ Partial | Uses dummy data |
| Admin Products | `/admin/dashboard/products` | ✅ Existing | Full CRUD |
| Admin Orders | `/admin/dashboard/orders` | ✅ Existing | Status tabs |
| Admin Customers | `/admin/dashboard/customers` | ✅ Existing | List and detail |
| Admin Coupons | `/admin/dashboard/coupons` | ✅ Existing | Full CRUD |
| Admin Offers | `/admin/dashboard/offers` | ✅ Existing | Full CRUD |
| Admin Inventory | `/admin/dashboard/inventory` | ⚠️ Partial | Needs stock reservation |
| Admin Reviews | `/admin/dashboard/reviews` | ✅ Existing | Moderation works |
| Admin Settings | `/admin/dashboard/settings` | ✅ Existing | Basic settings |