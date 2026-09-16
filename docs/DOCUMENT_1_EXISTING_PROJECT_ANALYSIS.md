# Document 1 — Existing Project Analysis

## 1.1 Project Overview

| Attribute | Value |
|---|---|
| **Project Name** | Zellora (package: `rithu-snacks`) |
| **Framework** | Next.js 16.3.0 (App Router, `--webpack`) |
| **React** | 19.2.8 |
| **Language** | TypeScript 5.x |
| **ORM** | Prisma 7.9.1 |
| **Database** | MariaDB/MySQL (via `@prisma/adapter-mariadb`) |
| **Auth** | NextAuth v5 (beta.32) + Custom JWT |
| **State** | TanStack Query + React Context |
| **Payments** | Razorpay |
| **Email** | Nodemailer (Brevo SMTP) |
| **WhatsApp** | Baileys (free WhatsApp Web protocol) |
| **UI** | Tailwind CSS 4, Lucide React, class-variance-authority |

---

## 1.2 Current Architecture

```
src/
├── app/                    # Next.js App Router (92 pages, 211 API routes)
│   ├── (store)/            # Customer storefront (25 routes)
│   ├── (auth)/             # Auth pages (7 routes)
│   ├── admin/              # Admin area (30+ routes)
│   ├── api/                # All API route handlers
│   └── layout.tsx
├── components/             # Shared components (28 UI, 15 forms, 15 admin, layout, storefront)
├── config/                 # siteConfig, productConfig, adminConfig
├── constants/              # Storefront constants
├── features/               # 36 feature modules (modular architecture)
├── generated/prisma/       # Generated Prisma client
├── hooks/                  # Global hooks
├── lib/                    # api, auth, db, email, permissions, utils, validations, whatsapp
├── providers/              # AppProviders, AuthProvider, QueryProvider
└── types/                  # Global TS types
```

---

## 1.3 Database Schema Summary

- **Models:** 93
- **Enums:** 31
- **Migrations:** 12 (from baseline `20260818100000_baseline`)

### Key Model Groups

#### Auth & RBAC
- `Role`, `Permission`, `RolePermission`
- `User`, `user_sessions`, `login_logs`, `otp_verifications`

#### Catalog
- `Product`, `ProductVariant`, `VariantUnitPrice`
- `ProductCategory`, `ProductBrand`
- `ProductAttribute`, `AttributeValue`
- `ProductImage`, `product_units`, `product_tags`
- `product_gst_rates`, `product_hsn_codes`

#### Commerce
- `Cart`, `CartItem`
- `WishlistItem`
- `Order`, `OrderItem`, `OrderAddress`, `order_status_history`
- `Coupon`, `coupon_usage`
- `Offer`, `offer_products`, `offer_items`

#### Payments
- `Payment`, `PaymentTransaction`
- `payment_methods`, `payment_gateway_webhooks`

#### Inventory
- `Inventory`, `InventoryTransaction`
- `stock_adjustments`, `stock_reports`, `variant_price_history`

#### Customer-Facing
- `CustomerAddress`, `Review`, `ReviewImage`
- `Blog`, `Banner`, `faq`, `contact_messages`
- `bulk_order_enquiries`, `Newsletter`
- `reward_points`, `Wallet`

#### Operations
- `shipments`, `shipment_tracking`
- `delivery_slots`, `delivery_partners`
- `return_requests`, `refunds`
- `shipping_zones`, `shipping_charges`, `pincode_serviceability`
- `settings`, `Company`, `seo_meta`, `AuditLog`

#### WhatsApp
- `WhatsAppCampaign`, `WhatsAppCampaignRecipient`, `WhatsAppTemplate`

---

## 1.4 Authentication Architecture

### Hybrid Approach
1. **NextAuth v5** (`src/lib/auth/auth.config.ts`) - JWT session strategy
2. **Custom JWT** (`src/lib/auth/jwt.ts`) - `access_token`/`refresh_token` HttpOnly cookies

### Middleware Protection
- `/admin/*` → ADMIN/STAFF only (redirects to `/admin/login`)
- `/cart`, `/checkout`, `/orders`, `/profile`, `/wishlist` → requires login (redirects to `/login?callbackUrl=...`)
- `/login`, `/register` → redirects authenticated users away

### Roles
- `ADMIN`
- `STAFF`
- `CUSTOMER`

---

## 1.5 API Architecture

### Pattern
```
API Route → features/{x}/services/*.service.ts → repositories/*.repository.ts → Prisma
```

### API Helpers
- `api-handler.ts` - Route handler wrapper
- `api-response.ts` - Response formatting
- `api-error.ts` - Error handling
- `http-status.ts` - Status codes
- `api-client.ts` - Client-side fetch wrapper
- `query-keys.ts` - TanStack Query key management

### API Groups (211 total)
| Group | Count | Purpose |
|---|---|---|
| `/api/admin/*` | 101 | Admin CRUD operations |
| `/api/customer/*` | 40 | Customer-facing operations |
| `/api/auth/*` | 12 | Authentication flows |
| Top-level | ~58 | Shared/utility endpoints |

---

## 1.6 Feature Modules (36)

Each feature follows:
```
src/features/{feature}/
├── api/            # Server-side data-access functions
├── components/     # Feature-specific UI
├── hooks/          # use<feature> hooks (TanStack Query)
├── repositories/   # Prisma data-access layer
├── services/       # Business logic
├── types/          # Feature types
├── validations/    # Zod schemas
└── index.ts        # Barrel export
```

### Features
1. products
2. variants
3. categories
4. brands
5. attributes
6. cart
7. wishlist
8. orders
9. payments
10. inventory
11. coupons
12. offers
13. customers
14. staff
15. roles
16. permissions
17. reviews
18. returns
19. banners
20. blogs
21. faqs
22. delivery
23. whatsapp
24. reports
25. settings
26. And 11 more...

---

## 1.7 Component Library

### UI Primitives (28)
Button, Input, Select, Checkbox, Switch, Radio, Textarea, Card, Badge, Modal, Tabs, Alert, Toast, Spinner, Skeleton, Pagination, Breadcrumb, ConfirmDialog, EmptyState, ErrorState, LoadingState, SearchInput, RichTextEditor, ExpandableRichText

### Form Components (15)
form-input, form-select, form-textarea, form-checkbox, form-image-upload, form-rich-text, form-video-url, form-submit-button, FormSwitch, FormPasswordInput, FormError, Label

### Admin Components (15+)
AdminTable, AdminTableSkeleton, admin-layout, admin-header, admin-sidebar, AdminBreadcrumb, AdminPageHeader, AdminDetailSkeleton, PageContainer, StatsCard, StatusToggle, SalesChart, RecentOrders, TopProducts, LowStockAlerts, DataTable

### Layout Components
header, footer, MegaMenu, CategoryNavDropdown, MobileCategoryAccordion, PageContainer

### Storefront Components
HeroSlider, Banner, CategorySection, ProductSection, Features, OfferPopup, OfferReels, ProductCard, SnackCard, ReviewCard, FilterSidebar

---

## 1.8 Current Pages

### Storefront (25 routes)
| Route | Purpose |
|---|---|
| `/` | Home page |
| `/products` | Product listing |
| `/products/[slug]` | Product detail |
| `/categories` | Categories |
| `/categories/[slug]` | Category products |
| `/category/[slug]` | Category products (alternate) |
| `/[category]/[[...slug]]` | Dynamic category routing |
| `/cart` | Shopping cart |
| `/checkout` | Checkout flow |
| `/checkout/address` | Address selection |
| `/checkout/payment` | Payment |
| `/checkout/success` | Order success |
| `/wishlist` | Wishlist |
| `/orders` | Order history |
| `/orders/[id]` | Order details |
| `/profile` | User profile |
| `/bulk-order` | Bulk order inquiry |
| `/about`, `/about-us` | About pages |
| `/faqs` | FAQs |
| `/privacy-policy` | Privacy policy |
| `/terms-and-conditions` | Terms |
| `/return-refund-policy` | Return policy |

### Auth (7 routes)
| Route | Purpose |
|---|---|
| `/login` | User login |
| `/register` | User registration |
| `/register/verify-otp` | Registration OTP |
| `/forgot-password` | Password reset |
| `/verify-otp` | OTP verification |
| `/verify-registration-otp` | Registration OTP |
| `/verify-forgot-password-otp` | Forgot password OTP |
| `/reset-password` | Password reset |

### Admin (30+ routes)
| Route | Purpose |
|---|---|
| `/admin` | Redirect to dashboard |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Dashboard |
| `/admin/dashboard/products` | Products |
| `/admin/dashboard/products/[id]` | Product detail |
| `/admin/dashboard/variants` | Variants |
| `/admin/dashboard/variants/[id]` | Variant detail |
| `/admin/dashboard/categories` | Categories |
| `/admin/dashboard/subcategories` | Subcategories |
| `/admin/dashboard/brands` | Brands |
| `/admin/dashboard/attributes` | Attributes |
| `/admin/dashboard/units` | Units |
| `/admin/dashboard/gst-rates` | GST rates |
| `/admin/dashboard/hsn-codes` | HSN codes |
| `/admin/dashboard/inventory` | Inventory |
| `/admin/dashboard/inventory/stock` | Stock management |
| `/admin/dashboard/inventory/history` | Stock history |
| `/admin/dashboard/orders` | Orders |
| `/admin/dashboard/customers` | Customers |
| `/admin/dashboard/customers/[id]` | Customer detail |
| `/admin/dashboard/users/customers` | Customer users |
| `/admin/dashboard/users/staff` | Staff users |
| `/admin/dashboard/staff` | Staff management |
| `/admin/dashboard/roles` | Roles |
| `/admin/dashboard/permissions` | Permissions |
| `/admin/dashboard/coupons` | Coupons |
| `/admin/dashboard/offers` | Offers |
| `/admin/dashboard/banners` | Banners |
| `/admin/dashboard/blogs` | Blogs |
| `/admin/dashboard/faqs` | FAQs |
| `/admin/dashboard/reviews` | Reviews |
| `/admin/dashboard/reports/*` | Reports |
| `/admin/dashboard/delivery` | Delivery |
| `/admin/dashboard/contacts` | Contact messages |
| `/admin/dashboard/bulk-orders` | Bulk orders |
| `/admin/dashboard/whatsapp/*` | WhatsApp |
| `/admin/dashboard/settings` | Settings |

---

## 1.9 Existing vs Target Analysis

### Already Implemented
- ✅ Authentication (login, register, OTP, password reset)
- ✅ Role-based access (ADMIN, STAFF, CUSTOMER)
- ✅ Product catalog (CRUD, variants, images, attributes)
- ✅ Category management (hierarchical)
- ✅ Brand management
- ✅ Shopping cart
- ✅ Wishlist
- ✅ Checkout flow
- ✅ Order management
- ✅ Payment integration (Razorpay)
- ✅ Inventory management
- ✅ Coupon system
- ✅ Offer system
- ✅ Review system
- ✅ Customer management
- ✅ Staff management
- ✅ Admin dashboard
- ✅ Reports (sales, revenue, products, orders, inventory, customers)
- ✅ Banner management
- ✅ Blog management
- ✅ FAQ management
- ✅ WhatsApp integration
- ✅ Email integration
- ✅ Delivery management
- ✅ Return/refund system
- ✅ Shipping zones
- ✅ Bulk order inquiries
- ✅ Newsletter
- ✅ Contact messages
- ✅ SEO meta
- ✅ Audit logging

### Potentially Incomplete/Needs Review
- ⚠️ Product variant system (needs verification for multi-attribute support)
- ⚠️ Inventory reservation during checkout
- ⚠️ Order tracking (shipment tracking)
- ⚠️ Return/refund workflow completeness
- ⚠️ Offer priority logic (multiple discounts)
- ⚠️ Search functionality depth
- ⚠️ Mobile responsiveness
- ⚠️ Loading/error/empty states consistency

### Missing (per target spec)
- ❓ Order tracking page for customers
- ❓ Product structured data (SEO)
- ❓ Frequently bought together
- ❓ Recently viewed products
- ❓ Recommended products
- ❓ Product comparison
- ❓ Size chart for fashion
- ❓ Multi-image upload per variant
- ❓ Variant-level inventory tracking
- ❓ Stock reservation during checkout
- ❓ Automated stock deduction on order confirmation
- ❓ Stock restoration on cancellation/return
- ❓ Coupon restrictions (category/product)
- ❓ Offer priority/stacking rules
- ❓ Admin role granularity (Super Admin, Product Manager, etc.)
- ❓ Admin permission per module (View, Create, Edit, Delete, Approve, Export)
- ❓ Product SEO (title, description, canonical, OG)
- ❓ Category SEO
- ❓ Structured data (JSON-LD)
- ❓ Image optimization (Next.js Image)
- ❓ Lazy loading
- ❓ Caching strategy
- ❓ Rate limiting
- ❓ CSRF protection
- ❓ Input validation completeness
- ❓ XSS protection
- ❓ File upload validation
- ❓ Payment verification completeness
- ❓ Sensitive data handling review

---

## 1.10 Key Findings

### Strengths
1. **Comprehensive feature set** - Most e-commerce features are already implemented
2. **Modular architecture** - Feature-based structure is clean and maintainable
3. **Type-safe** - TypeScript + Zod validation
4. **Modern stack** - Next.js 16, React 19, Prisma 7, Tailwind 4
5. **Full admin panel** - Extensive admin functionality
6. **Multiple integrations** - Payment, email, WhatsApp

### Areas for Improvement
1. **Variant system** - May need enhancement for multi-category attributes
2. **Inventory management** - Reservation/deduction logic needs verification
3. **Order tracking** - Customer-facing tracking may be incomplete
4. **SEO** - Structured data and metadata may be missing
5. **Performance** - Image optimization, caching, lazy loading
6. **Security** - Rate limiting, CSRF, input validation audit
7. **Mobile** - Responsiveness audit needed
8. **State consistency** - Loading/error/empty states standardization

### Recommendation
The project is **85-90% complete** for a multi-category e-commerce platform. The focus should be on:
1. Verifying and enhancing existing features
2. Adding missing e-commerce best practices
3. Performance optimization
4. Security hardening
5. Mobile responsiveness audit