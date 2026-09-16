# Document 3 — Admin Flow

## 3.1 Admin Login Flow

```
Admin User
    ↓
/admin/login
    ↓
Enter Email/Password
    ↓
Validate (Zod)
    ↓
POST /api/auth/login
    ↓
Check Role = ADMIN or STAFF
    ↓
If ADMIN → /admin/dashboard
If STAFF → /admin/dashboard
If CUSTOMER → /unauthorized
```

### Middleware Protection
- `/admin/*` routes protected by middleware
- Checks session for ADMIN or STAFF role
- Redirects to `/admin/login` if unauthorized

---

## 3.2 Admin Dashboard Flow

```
Admin Login
    ↓
/admin/dashboard
    ↓
┌─────────────────────────────────────────┐
│  Welcome back, [Admin Name]             │
│  Here's what's happening with your store│
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Stats Cards (4x2 grid)                 │
│  - Total Products                       │
│  - Total Categories                     │
│  - Total Customers                      │
│  - Total Orders                         │
│  - Revenue                              │
│  - Pending Orders                       │
│  - Low Stock                            │
│  - Today's Orders                       │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Sales Chart (weekly)  │  Top Products  │
│                        │                │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Recent Orders       │  Low Stock Alerts│
│                      │                  │
└─────────────────────────────────────────┘
```

### API Calls
- `GET /api/dashboard/stats` → Stats cards

### Known Issues
- Sales chart uses DUMMY_DATA
- Recent orders uses DUMMY_DATA
- Top products uses DUMMY_DATA
- Low stock alerts uses DUMMY_DATA

---

## 3.3 Catalog Management Flow

### 3.3.1 Product Management

```
Admin Dashboard
    ↓
/catalog/products
    ↓
┌─────────────────────────────────────────┐
│  Products Table                         │
│  [Search] [Filter] [Add Product]        │
├─────────────────────────────────────────┤
│  Image | Name | Category | Brand |      │
│  Price | Stock | Status | Actions       │
├─────────────────────────────────────────┤
│  ... rows ...                           │
├─────────────────────────────────────────┤
│  Pagination                             │
└─────────────────────────────────────────┘
```

#### Create Product Flow
```
Click "Add Product"
    ↓
Step 1: Basic Details
    - Name
    - Description (Rich Text)
    - Category (select)
    - Sub Category (select)
    - Brand (select)
    - SKU
    - Status (active/inactive)
    ↓
Step 2: Images
    - Upload primary image
    - Upload additional images
    - Crop/resize
    ↓
Step 3: Pricing
    - MRP
    - Selling Price
    - Cost Price
    - Tax Rate
    ↓
Step 4: Variants
    - Add variant (e.g., Color: Red, Size: M)
    - Set variant price
    - Set variant SKU
    - Set variant stock
    ↓
Step 5: Attributes
    - Select attribute type (from predefined)
    - Set attribute values
    ↓
Step 6: SEO
    - Meta Title
    - Meta Description
    - Slug
    ↓
Step 7: Publish
    - Review
    - Save / Publish
```

#### Edit Product Flow
```
Click Product Row → /admin/dashboard/products/[id]
    ↓
Same steps as Create
    ↓
Update specific fields
    ↓
Save Changes
```

#### Delete Product Flow
```
Click Delete Icon
    ↓
Confirm Dialog
    ↓
DELETE /api/admin/products/[id]
    ↓
Product removed
```

### 3.3.2 Variant Management

```
Admin Dashboard
    ↓
/catalog/variants
    ↓
┌─────────────────────────────────────────┐
│  Variants Table                         │
│  [Search] [Filter] [Add Variant]        │
├─────────────────────────────────────────┤
│  Product | SKU | Attributes | Price |   │
│  Stock | Status | Actions               │
├─────────────────────────────────────────┤
│  ... rows ...                           │
└─────────────────────────────────────────┘
```

#### Variant Attributes by Category

**Fashion:**
- Color
- Size
- Material
- Pattern
- Gender

**Electronics:**
- RAM
- Storage
- Color
- Model

**Watches:**
- Dial Color
- Strap Material
- Display Type
- Water Resistance

**Jewellery:**
- Material
- Color
- Size

### 3.3.3 Category Management

```
Admin Dashboard
    ↓
/catalog/categories
    ↓
┌─────────────────────────────────────────┐
│  Categories Table                       │
│  [Search] [Add Category]                │
├─────────────────────────────────────────┤
│  Name | Parent | Products | Status |    │
│  Actions                                │
├─────────────────────────────────────────┤
│  ... rows ...                           │
└─────────────────────────────────────────┘
```

#### Create Category Flow
```
Click "Add Category"
    ↓
Form Modal
    - Name
    - Description
    - Parent Category (optional)
    - Image
    - Status (active/inactive)
    ↓
POST /api/admin/categories
    ↓
Category created
```

### 3.3.4 Brand Management

```
Admin Dashboard
    ↓
/catalog/brands
    ↓
┌─────────────────────────────────────────┐
│  Brands Table                           │
│  [Search] [Add Brand]                   │
├─────────────────────────────────────────┤
│  Name | Logo | Products | Status |      │
│  Actions                                │
├─────────────────────────────────────────┤
│  ... rows ...                           │
└─────────────────────────────────────────┘
```

### 3.3.5 Inventory Management

```
Admin Dashboard
    ↓
/catalog/inventory
    ↓
┌─────────────────────────────────────────┐
│  Inventory Overview                     │
├─────────────────────────────────────────┤
│  Total Items | In Stock | Low Stock |   │
│  Out of Stock                           │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Inventory Table                        │
│  [Search] [Filter] [Adjust Stock]       │
├─────────────────────────────────────────┤
│  Product | Variant | SKU | Current |    │
│  Reserved | Available | Status | Actions│
├─────────────────────────────────────────┤
│  ... rows ...                           │
└─────────────────────────────────────────┘
```

#### Stock Adjustment Flow
```
Click "Adjust Stock"
    ↓
Form Modal
    - Select Product/Variant
    - Adjustment Type (in/out/correction)
    - Quantity
    - Reason
    ↓
POST /api/inventory/adjust
    ↓
Inventory updated
    ↓
Stock history recorded
```

#### Stock Flow
```
Order Placed → Check Stock → Reserve Stock
    ↓
Order Confirmed → Deduct Stock
    ↓
Order Cancelled → Restore Stock
    ↓
Order Returned → Restore Stock (after quality check)
```

---

## 3.4 Sales Management Flow

### 3.4.1 Order Management

```
Admin Dashboard
    ↓
/sales/orders
    ↓
┌─────────────────────────────────────────┐
│  Status Tabs                            │
│  [Pending] [Confirmed] [Processing]     │
│  [Packed] [Shipped] [Out for Delivery]  │
│  [Delivered] [Cancelled] [Returned]     │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Orders Table                           │
│  [Search] [Filter] [Export]             │
├─────────────────────────────────────────┤
│  Order ID | Customer | Date | Total |   │
│  Status | Payment | Actions             │
├─────────────────────────────────────────┤
│  ... rows ...                           │
└─────────────────────────────────────────┘
```

#### Order Status Flow
```
pending
    ↓
confirmed (Admin confirms)
    ↓
processing (Admin processes)
    ↓
packed (Admin packs)
    ↓
shipped (Admin ships)
    ↓
out_for_delivery (Delivery partner updates)
    ↓
delivered (Customer confirms)
    ↓
[Optional] returned (Customer requests)
```

#### Order Actions by Status

| Status | Available Actions |
|---|---|
| `pending` | Confirm, Cancel |
| `confirmed` | Process, Cancel |
| `processing` | Pack |
| `packed` | Ship |
| `shipped` | Update tracking |
| `out_for_delivery` | Mark delivered |
| `delivered` | View only |
| `cancelled` | View only |
| `returned` | Process refund |

### 3.4.2 Payment Management

```
Admin Dashboard
    ↓
/sales/payments
    ↓
┌─────────────────────────────────────────┐
│  Payments Table                         │
│  [Search] [Filter] [Export]             │
├─────────────────────────────────────────┤
│  Payment ID | Order | Amount | Method | │
│  Status | Date | Actions                │
├─────────────────────────────────────────┤
│  ... rows ...                           │
└─────────────────────────────────────────┘
```

### 3.4.3 Shipment Management

```
Admin Dashboard
    ↓
/sales/shipments
    ↓
┌─────────────────────────────────────────┐
│  Shipments Table                        │
│  [Search] [Filter] [Add Shipment]       │
├─────────────────────────────────────────┤
│  Order | Carrier | Tracking | Status |  │
│  Actions                                │
├─────────────────────────────────────────┤
│  ... rows ...                           │
└─────────────────────────────────────────┘
```

#### Shipment Flow
```
Order Packed
    ↓
Create Shipment
    - Select Carrier
    - Enter Tracking Number
    - Set Estimated Delivery
    ↓
Ship Shipment
    ↓
Track Shipment
    ↓
Deliver Shipment
```

### 3.4.4 Return Management

```
Admin Dashboard
    ↓
/sales/returns
    ↓
┌─────────────────────────────────────────┐
│  Return Requests Table                  │
│  [Search] [Filter] [Status]             │
├─────────────────────────────────────────┤
│  Order | Customer | Reason | Status |   │
│  Actions                                │
├─────────────────────────────────────────┤
│  ... rows ...                           │
└─────────────────────────────────────────┘
```

#### Return Flow
```
Delivered Order
    ↓
Customer Requests Return
    ↓
Return Request Created
    ↓
Admin Reviews Request
    ↓
┌─────────────────┬─────────────────┐
│ Approve         │ Reject          │
│ ↓               │ ↓               │
│ Pickup Scheduled│ Customer Notified│
│ ↓               └─────────────────┘
│ Product Received
│ ↓
│ Quality Check
│ ↓
┌─────────────────┬─────────────────┐
│ Pass            │ Fail            │
│ ↓               │ ↓               │
│ Refund Initiated│ Return Rejected │
│ ↓               └─────────────────┘
│ Refund Completed
```

---

## 3.5 Marketing Management Flow

### 3.5.1 Banner Management

```
Admin Dashboard
    ↓
/marketing/banners
    ↓
┌─────────────────────────────────────────┐
│  Banners Table                          │
│  [Search] [Add Banner]                  │
├─────────────────────────────────────────┤
│  Image | Title | Position | Status |    │
│  Actions                                │
├─────────────────────────────────────────┤
│  ... rows ...                           │
└─────────────────────────────────────────┘
```

#### Banner Positions
- Hero (homepage)
- Category page
- Product page
- Footer
- Popup

### 3.5.2 Coupon Management

```
Admin Dashboard
    ↓
/marketing/coupons
    ↓
┌─────────────────────────────────────────┐
│  Coupons Table                          │
│  [Search] [Add Coupon]                  │
├─────────────────────────────────────────┤
│  Code | Type | Value | Min Order |      │
│  Usage | Status | Actions               │
├─────────────────────────────────────────┤
│  ... rows ...                           │
└─────────────────────────────────────────┘
```

#### Coupon Validation Rules
```
1. Check coupon exists
2. Check coupon is active
3. Check start date <= now <= end date
4. Check usage limit not exceeded
5. Check per user limit not exceeded
6. Check minimum order amount
7. Check category/product restrictions (if any)
8. Calculate discount
9. Apply maximum discount cap
```

### 3.5.3 Offer Management

```
Admin Dashboard
    ↓
/marketing/offers
    ↓
┌─────────────────────────────────────────┐
│  Offers Table                           │
│  [Search] [Add Offer]                   │
├─────────────────────────────────────────┤
│  Name | Type | Discount | Validity |    │
│  Status | Actions                       │
├─────────────────────────────────────────┤
│  ... rows ...                           │
└─────────────────────────────────────────┘
```

#### Offer Types
- **Product Offer:** Discount on specific products
- **Category Offer:** Discount on all products in category
- **Brand Offer:** Discount on all products of brand
- **Festival Offer:** Time-bound promotional offer
- **Flash Sale:** Limited time, limited stock offer

#### Offer Priority/Stacking Rules
```
Product Discount (base)
    ↓
+ Coupon Discount (if applicable)
    ↓
+ Category Offer (if applicable)
    ↓
= Final Price
```

**Note:** Need to define if offers can stack or if only the best offer applies.

---

## 3.6 Customer Management Flow

```
Admin Dashboard
    ↓
/customers
    ↓
┌─────────────────────────────────────────┐
│  Customers Table                        │
│  [Search] [Filter] [Export]             │
├─────────────────────────────────────────┤
│  Name | Email | Phone | Orders |        │
│  Spending | Status | Actions            │
├─────────────────────────────────────────┤
│  ... rows ...                           │
└─────────────────────────────────────────┘
    ↓
Click Customer → /admin/dashboard/customers/[id]
    ↓
┌─────────────────────────────────────────┐
│  Customer Detail                        │
├─────────────────────────────────────────┤
│  Profile Info                           │
│  - Name, Email, Phone                   │
│  - Total Orders                         │
│  - Total Spending                       │
│  - Account Status                       │
├─────────────────────────────────────────┤
│  Orders List                            │
│  - Recent orders                        │
│  - Order history                        │
├─────────────────────────────────────────┤
│  Addresses                              │
│  - Saved addresses                      │
├─────────────────────────────────────────┤
│  Reviews                                │
│  - Customer reviews                     │
└─────────────────────────────────────────┘
```

---

## 3.7 Review Moderation Flow

```
Admin Dashboard
    ↓
/customers/reviews
    ↓
┌─────────────────────────────────────────┐
│  Reviews Table                          │
│  [Search] [Filter] [Status]             │
├─────────────────────────────────────────┤
│  Product | Customer | Rating | Review | │
│  Status | Actions                       │
├─────────────────────────────────────────┤
│  ... rows ...                           │
└─────────────────────────────────────────┘
```

#### Review Actions
- **Approve:** Make review visible on product page
- **Reject:** Hide review
- **Delete:** Permanently remove review

---

## 3.8 Reports Flow

```
Admin Dashboard
    ↓
/reports
    ↓
┌─────────────────────────────────────────┐
│  Report Types                           │
├─────────────────────────────────────────┤
│  - Sales Report                         │
│  - Revenue Report                       │
│  - Products Report                      │
│  - Orders Report                        │
│  - Inventory Report                     │
│  - Customers Report                     │
└─────────────────────────────────────────┘
    ↓
Select Report Type
    ↓
Set Date Range
    ↓
Generate Report
    ↓
┌─────────────────────────────────────────┐
│  Report Data                            │
│  - Charts                               │
│  - Tables                               │
│  - Summary                              │
│  - Export (CSV/PDF)                     │
└─────────────────────────────────────────┘
```

---

## 3.9 Settings Flow

```
Admin Dashboard
    ↓
/settings
    ↓
┌─────────────────────────────────────────┐
│  Settings Tabs                          │
├─────────────────────────────────────────┤
│  - Company                              │
│  - Payment                              │
│  - Shipping                             │
│  - Email                                │
│  - Notification                         │
└─────────────────────────────────────────┘
```

### Company Settings
- Company name
- Logo
- Address
- Contact info
- GST details

### Payment Settings
- Razorpay keys
- COD settings
- Payment methods

### Shipping Settings
- Shipping zones
- Shipping charges
- Delivery partners
- Pincode serviceability

### Email Settings
- SMTP configuration
- Email templates

---

## 3.10 Staff Management Flow

```
Admin Dashboard
    ↓
/users/staff
    ↓
┌─────────────────────────────────────────┐
│  Staff Table                            │
│  [Search] [Add Staff]                   │
├─────────────────────────────────────────┤
│  Name | Email | Role | Status |         │
│  Last Login | Actions                   │
├─────────────────────────────────────────┤
│  ... rows ...                           │
└─────────────────────────────────────────┘
```

#### Staff Roles
- **Admin:** Full access
- **Staff:** Limited access based on permissions

### Permissions System
```
Role
  ↓
Permission[]
  ↓
Module + Action
```

#### Permission Modules
- Products
- Orders
- Customers
- Inventory
- Marketing
- Settings
- Reports

#### Permission Actions
- View
- Create
- Edit
- Delete
- Approve
- Export

---

## 3.11 Admin Navigation Structure

```
/admin/dashboard
├── Dashboard
│
├── Catalog
│   ├── Products
│   ├── Variants
│   ├── Categories
│   ├── Subcategories
│   ├── Brands
│   ├── Attributes
│   ├── Units
│   ├── GST Rates
│   └── HSN Codes
│
├── Inventory
│   ├── Stock
│   └── History
│
├── Sales
│   ├── Orders
│   │   ├── Pending
│   │   ├── Confirmed
│   │   ├── Processing
│   │   ├── Packed
│   │   ├── Shipped
│   │   ├── Out for Delivery
│   │   ├── Delivered
│   │   ├── Cancelled
│   │   └── Returned
│   ├── Payments
│   ├── Shipments
│   ├── Returns
│   └── Refunds
│
├── Marketing
│   ├── Banners
│   ├── Coupons
│   ├── Offers
│   └── Notifications
│
├── Customers
│   ├── Customers
│   └── Reviews
│
├── Users
│   ├── Customers
│   └── Staff
│
├── Roles & Permissions
│   ├── Roles
│   └── Permissions
│
├── Reports
│   ├── Sales
│   ├── Revenue
│   ├── Products
│   ├── Orders
│   ├── Inventory
│   └── Customers
│
├── Content
│   ├── Blogs
│   ├── FAQs
│   └── CMS
│
├── WhatsApp
│   ├── Campaigns
│   ├── Templates
│   └── Reports
│
├── Delivery
│   ├── Partners
│   ├── Slots
│   └── Zones
│
├── Contacts
│
├── Bulk Orders
│
└── Settings
    ├── Company
    ├── Payment
    ├── Shipping
    └── Email
```

---

## 3.12 Admin Permissions Matrix

| Module | Admin | Staff | Notes |
|---|---|---|---|
| Dashboard | View | View | Stats only |
| Products | CRUD | View/Edit | Based on role |
| Variants | CRUD | View/Edit | Based on role |
| Categories | CRUD | View | Admin only |
| Brands | CRUD | View | Admin only |
| Inventory | View/Adjust | View/Adjust | Based on role |
| Orders | View/Update | View/Update | Based on role |
| Payments | View | View | Read only |
| Shipments | CRUD | View | Admin only |
| Returns | View/Approve | View | Admin only |
| Coupons | CRUD | View | Admin only |
| Offers | CRUD | View | Admin only |
| Customers | View | View | Read only |
| Reviews | View/Moderate | View | Admin only |
| Reports | View/Export | View | Based on role |
| Settings | CRUD | View | Admin only |
| Staff | CRUD | View | Admin only |
| Roles | CRUD | View | Admin only |

---

## 3.13 Existing vs Required Admin Flow

### Already Implemented
- ✅ Admin login with role check
- ✅ Dashboard with stats cards
- ✅ Product CRUD
- ✅ Variant management
- ✅ Category management
- ✅ Brand management
- ✅ Order management with status tabs
- ✅ Customer management
- ✅ Coupon management
- ✅ Offer management
- ✅ Inventory management
- ✅ Review moderation
- ✅ Staff management
- ✅ Roles & permissions
- ✅ Reports (basic)
- ✅ Settings
- ✅ Blog management
- ✅ FAQ management
- ✅ WhatsApp integration

### Needs Modification
- ⚠️ Dashboard: Replace dummy data with real API calls
- ⚠️ Order management: Integrate shipment tracking
- ⚠️ Inventory: Add stock reservation during checkout
- ⚠️ Offers: Define priority/stacking rules
- ⚠️ Coupons: Add category/product restrictions
- ⚠️ Reports: Add more report types, export functionality
- ⚠️ Settings: Add shipping zones, payment gateways configuration

### Missing
- ❓ Bulk product import/export
- ❓ Bulk order actions
- ❓ Scheduled offers
- ❓ Offer analytics
- ❓ Customer groups
- ❓ Automated stock alerts
- ❓ Automated reordering
- ❓ Invoice generation
- ❓ Shipping label generation
- ❓ Real-time dashboard updates