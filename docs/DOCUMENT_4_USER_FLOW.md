# Document 4 — User Flow

## 4.1 Guest User Flow

```
New Visitor
    ↓
Home Page (/)
    ↓
┌─────────────────────────────────────────┐
│  Browse Categories                      │
│  View Featured Products                 │
│  View Promotions                        │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Search Products                        │
│  Filter by Category                     │
│  Sort by Price/Rating                   │
└─────────────────────────────────────────┘
    ↓
Product Listing (/products)
    ↓
Product Detail (/products/[slug])
    ↓
┌─────────────────────────────────────────┐
│  View Product Details                   │
│  Select Variant (Color/Size)            │
│  View Price/Discount                    │
│  View Reviews                           │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Add to Cart (requires login)           │
│  Add to Wishlist (requires login)       │
└─────────────────────────────────────────┘
    ↓
If not logged in → Redirect to /login
```

---

## 4.2 Authentication Flow

### 4.2.1 Login Flow

```
Click "Login"
    ↓
/login
    ↓
┌─────────────────────────────────────────┐
│  Enter Email/Phone                      │
│  Enter Password                         │
│  [Remember Me]                          │
│  [Forgot Password?]                     │
│  [Create Account]                       │
└─────────────────────────────────────────┘
    ↓
POST /api/auth/login
    ↓
┌─────────────────┬─────────────────┐
│ Success         │ Failure         │
│ ↓               │ ↓               │
│ Check Role      │ Show Error      │
│ ↓               └─────────────────┘
│ If CUSTOMER → /
│ If ADMIN → /admin/dashboard
│ If STAFF → /admin/dashboard
```

### 4.2.2 Registration Flow

```
Click "Create Account"
    ↓
/register
    ↓
┌─────────────────────────────────────────┐
│  Enter Name                             │
│  Enter Email                            │
│  Enter Phone                            │
│  Enter Password                         │
│  Confirm Password                       │
│  [Accept Terms]                         │
└─────────────────────────────────────────┘
    ↓
POST /api/auth/register
    ↓
┌─────────────────┬─────────────────┐
│ Success         │ Failure         │
│ ↓               │ ↓               │
│ Send OTP        │ Show Error      │
│ ↓               └─────────────────┘
/register/verify-otp
    ↓
┌─────────────────────────────────────────┐
│  Enter OTP (sent to email/phone)        │
│  [Resend OTP]                           │
└─────────────────────────────────────────┘
    ↓
POST /api/auth/verify-registration-otp
    ↓
┌─────────────────┬─────────────────┐
│ Success         │ Failure         │
│ ↓               │ ↓               │
│ Account Created │ Show Error      │
│ ↓               └─────────────────┘
│ Auto Login
│ ↓
│ Redirect to /
```

### 4.2.3 Forgot Password Flow

```
Click "Forgot Password"
    ↓
/forgot-password
    ↓
┌─────────────────────────────────────────┐
│  Enter Email                            │
└─────────────────────────────────────────┘
    ↓
POST /api/auth/forgot-password
    ↓
┌─────────────────┬─────────────────┐
│ Success         │ Failure         │
│ ↓               │ ↓               │
│ Send OTP        │ Show Error      │
│ ↓               └─────────────────┘
/verify-forgot-password-otp
    ↓
┌─────────────────────────────────────────┐
│  Enter OTP                              │
│  [Resend OTP]                           │
└─────────────────────────────────────────┘
    ↓
POST /api/auth/verify-forgot-password-otp
    ↓
┌─────────────────┬─────────────────┐
│ Success         │ Failure         │
│ ↓               │ ↓               │
│ Reset Password  │ Show Error      │
│ ↓               └─────────────────┘
/reset-password
    ↓
┌─────────────────────────────────────────┐
│  Enter New Password                     │
│  Confirm New Password                   │
└─────────────────────────────────────────┘
    ↓
POST /api/auth/reset-password
    ↓
┌─────────────────┬─────────────────┐
│ Success         │ Failure         │
│ ↓               │ ↓               │
│ Password Reset  │ Show Error      │
│ ↓               └─────────────────┘
│ Redirect to /login
```

---

## 4.3 Authenticated User Flow

### 4.3.1 Product Discovery Flow

```
Logged In User
    ↓
Home Page (/)
    ↓
┌─────────────────────────────────────────┐
│  View Hero Banner → Category/Product    │
│  View Categories → Category Listing     │
│  View Featured Products → Product Detail│
│  View Offers → Product Detail           │
└─────────────────────────────────────────┘
    ↓
Search (/products?search=...)
    ↓
┌─────────────────────────────────────────┐
│  Enter Search Query                     │
│  View Search Results                    │
│  Apply Filters                          │
│  Sort Results                           │
└─────────────────────────────────────────┘
    ↓
Category (/categories/[slug])
    ↓
┌─────────────────────────────────────────┐
│  View Category Products                 │
│  Filter by Subcategory                  │
│  Filter by Brand                        │
│  Filter by Price                        │
│  Sort Results                           │
└─────────────────────────────────────────┘
    ↓
Product Listing (/products)
    ↓
┌─────────────────────────────────────────┐
│  View All Products                      │
│  Apply Multiple Filters                 │
│  Infinite Scroll                        │
└─────────────────────────────────────────┘
```

### 4.3.2 Product Detail Flow

```
Click Product Card
    ↓
/products/[slug]
    ↓
┌─────────────────────────────────────────┐
│  View Product Images                    │
│  View Product Name                      │
│  View Brand                             │
│  View Rating/Reviews                    │
│  View Price/MRP/Discount                │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Select Variant                         │
│  - Color (updates images)               │
│  - Size (updates stock)                 │
│  - Other attributes                     │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  View Stock Status                      │
│  - In Stock                             │
│  - Low Stock (only X left)              │
│  - Out of Stock                         │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Select Quantity                        │
│  Click "Add to Cart"                    │
│  Click "Add to Wishlist"                │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  View Description                       │
│  View Specifications                    │
│  View Reviews                           │
│  View Related Products                  │
└─────────────────────────────────────────┘
```

### 4.3.3 Wishlist Flow

```
Click "Add to Wishlist" on Product
    ↓
POST /api/customer/wishlist
    ↓
┌─────────────────┬─────────────────┐
│ Success         │ Already Exists  │
│ ↓               │ ↓               │
│ Toast: Added    │ Toast: Already  │
│ to Wishlist     │ in Wishlist     │
└─────────────────┴─────────────────┘
    ↓
/wishlist
    ↓
┌─────────────────────────────────────────┐
│  View Wishlist Items                    │
│  - Product Image                        │
│  - Product Name                         │
│  - Price                                │
│  - Stock Status                         │
│  - "Move to Cart" button                │
│  - "Remove" button                      │
└─────────────────────────────────────────┘
    ↓
Click "Move to Cart"
    ↓
POST /api/customer/wishlist/[id]/move-to-cart
    ↓
┌─────────────────────────────────────────┐
│  Item moved to cart                     │
│  Cart badge updated                     │
│  Wishlist updated                       │
└─────────────────────────────────────────┘
```

### 4.3.4 Cart Flow

```
Click "Add to Cart" on Product
    ↓
POST /api/customer/cart
    ↓
┌─────────────────────────────────────────┐
│  Product added to cart                  │
│  Cart badge updated                     │
│  Toast notification                     │
└─────────────────────────────────────────┘
    ↓
/cart
    ↓
┌─────────────────────────────────────────┐
│  View Cart Items                        │
│  - Product Image                        │
│  - Product Name                         │
│  - Variant (Color/Size)                 │
│  - Price                                │
│  - Quantity Controls (- / +)            │
│  - Subtotal                             │
│  - Remove button                        │
├─────────────────────────────────────────┤
│  Cart Summary                           │
│  - Subtotal                             │
│  - Shipping (Free if ≥₹500, else ₹40) │
│  - Total                                │
│  - "Proceed to Checkout" button         │
│  - "Continue Shopping" link             │
└─────────────────────────────────────────┘
    ↓
Update Quantity
    ↓
PATCH /api/customer/cart/items/[id]
    ↓
┌─────────────────────────────────────────┐
│  Quantity updated                       │
│  Subtotal recalculated                  │
│  Total recalculated                     │
└─────────────────────────────────────────┘
```

### 4.3.5 Checkout Flow

```
Click "Proceed to Checkout"
    ↓
/checkout
    ↓
┌─────────────────────────────────────────┐
│  Step 1: Delivery Address               │
│  ┌─────────────────────────────────────┐│
│  │ Saved Address 1 (selected)          ││
│  │ Saved Address 2                     ││
│  │ [+ Add New Address]                 ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Step 2: Shipping Method                │
│  ○ Standard (Free / ₹40)               │
│  ○ Express (₹100)                      │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Step 3: Payment Method                 │
│  ○ Razorpay (Online)                   │
│  ○ Cash on Delivery (COD)              │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Step 4: Special Instructions           │
│  [Text area for delivery notes]         │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Order Summary (Right Sidebar)          │
│  - Items list                           │
│  - Subtotal                             │
│  - Shipping                             │
│  - Discount (if coupon applied)         │
│  - Total                                │
│  - [Place Order] button                 │
└─────────────────────────────────────────┘
    ↓
Click "Place Order"
    ↓
┌─────────────────┬─────────────────┐
│ Razorpay        │ COD             │
│ ↓               │ ↓               │
│ Initiate Payment│ Create Order    │
│ ↓               │ ↓               │
│ Payment Modal   │ Order Created   │
│ ↓               │ ↓               │
│ Verify Payment  │ Redirect to     │
│ ↓               │ Success Page    │
│ Create Order    └─────────────────┘
│ ↓
│ Redirect to
│ Success Page
```

### 4.3.6 Payment Flow (Razorpay)

```
Click "Pay Now"
    ↓
POST /api/customer/payment/create-order
    ↓
┌─────────────────────────────────────────┐
│  Razorpay Order Created                 │
│  Returns order_id                       │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Razorpay Checkout Modal Opens          │
│  - Card                                 │
│  - UPI                                  │
│  - Netbanking                           │
│  - Wallet                               │
└─────────────────────────────────────────┘
    ↓
User Completes Payment
    ↓
┌─────────────────────────────────────────┐
│  Payment Success                        │
│  - razorpay_order_id                    │
│  - razorpay_payment_id                  │
│  - razorpay_signature                   │
└─────────────────────────────────────────┘
    ↓
POST /api/customer/payment/verify
    ↓
┌─────────────────────────────────────────┐
│  Verify Signature                       │
│  - Validate razorpay_signature          │
│  - Check order_id matches               │
│  - Check payment_id matches             │
└─────────────────────────────────────────┘
    ↓
┌─────────────────┬─────────────────┐
│ Valid           │ Invalid         │
│ ↓               │ ↓               │
│ Create Order    │ Show Error      │
│ ↓               │ ↓               │
│ Deduct Stock    │ Payment Failed  │
│ ↓               └─────────────────┘
│ Order Confirmed
│ ↓
│ Redirect to
│ /checkout/success?orderId=xxx&orderNumber=yyy
```

### 4.3.7 Order Confirmation Flow

```
Payment Success
    ↓
/checkout/success?orderId=xxx&orderNumber=yyy
    ↓
┌─────────────────────────────────────────┐
│  Order Placed Successfully!             │
│  Order Number: #ORD-XXXX                │
├─────────────────────────────────────────┤
│  Order Details                          │
│  - Status: Pending                      │
│  - Items                                │
│  - Shipping Address                     │
│  - Payment Method                       │
│  - Total                                │
├─────────────────────────────────────────┤
│  [View Order History]                   │
│  [Continue Shopping]                    │
└─────────────────────────────────────────┘
```

---

## 4.4 Order Management Flow (Customer)

### 4.4.1 Orders List Flow

```
Click "My Orders"
    ↓
/orders
    ↓
┌─────────────────────────────────────────┐
│  Search by Order Number                 │
│  Filter by Status                       │
├─────────────────────────────────────────┤
│  Order Cards                            │
│  - Order Number                         │
│  - Date                                 │
│  - Items                                │
│  - Total                                │
│  - Status Badge                         │
│  - [View Details] button                │
├─────────────────────────────────────────┤
│  Pagination                             │
└─────────────────────────────────────────┘
```

### 4.4.2 Order Detail Flow

```
Click "View Details" on Order
    ↓
/orders/[id]
    ↓
┌─────────────────────────────────────────┐
│  Order Number: #ORD-XXXX                │
│  Status: [Status Badge]                 │
├─────────────────────────────────────────┤
│  Order Timeline                         │
│  ○ Placed - Sep 3, 2026                 │
│  ○ Confirmed - Sep 3, 2026              │
│  ○ Processing - Sep 4, 2026             │
│  ● Packed - Sep 4, 2026 (current)       │
│  ○ Shipped - (pending)                  │
│  ○ Delivered - (pending)                │
├─────────────────────────────────────────┤
│  Items                                  │
│  - Product 1 (Qty: 2) - ₹998           │
│  - Product 2 (Qty: 1) - ₹499           │
├─────────────────────────────────────────┤
│  Shipping Address                       │
│  - Name                                 │
│  - Address                              │
│  - City, State, PIN                     │
├─────────────────────────────────────────┤
│  Payment Information                    │
│  - Method: Razorpay                     │
│  - Status: Paid                         │
│  - Transaction ID                       │
├─────────────────────────────────────────┤
│  Order Total                            │
│  - Subtotal: ₹1,497                     │
│  - Shipping: ₹0                         │
│  - Total: ₹1,497                        │
├─────────────────────────────────────────┤
│  Actions (based on status)              │
│  - [Cancel Order] (if pending/confirmed)│
│  - [Track Order] (if shipped)           │
│  - [Return] (if delivered)              │
│  - [Write Review] (if delivered)        │
└─────────────────────────────────────────┘
```

### 4.4.3 Cancel Order Flow

```
Click "Cancel Order"
    ↓
┌─────────────────────────────────────────┐
│  Confirm Cancellation                   │
│  "Are you sure you want to cancel       │
│   this order?"                          │
│  [Cancel] [Confirm]                     │
└─────────────────────────────────────────┘
    ↓
Click "Confirm"
    ↓
PATCH /api/customer/orders/[id]/cancel
    ↓
┌─────────────────────────────────────────┐
│  Order Cancelled                        │
│  - Status updated to "cancelled"        │
│  - Stock restored                       │
│  - Payment refunded (if prepaid)        │
└─────────────────────────────────────────┘
```

### 4.4.4 Return Order Flow

```
Order Status: Delivered
    ↓
Click "Return"
    ↓
┌─────────────────────────────────────────┐
│  Return Request Form                    │
│  - Reason (select)                      │
│    - Wrong size                         │
│    - Defective                          │
│    - Not as described                   │
│    - Changed mind                       │
│    - Other                              │
│  - Comments (optional)                  │
│  - Upload Images (optional)             │
└─────────────────────────────────────────┘
    ↓
POST /api/customer/returns
    ↓
┌─────────────────────────────────────────┐
│  Return Request Submitted               │
│  - Status: Return Requested             │
│  - Admin will review                    │
└─────────────────────────────────────────┘
    ↓
Admin Reviews Request
    ↓
┌─────────────────┬─────────────────┐
│ Approved        │ Rejected        │
│ ↓               │ ↓               │
│ Pickup Scheduled│ Customer Notified│
│ ↓               └─────────────────┘
│ Product Returned
│ ↓
│ Quality Check
│ ↓
┌─────────────────┬─────────────────┐
│ Passed          │ Failed          │
│ ↓               │ ↓               │
│ Refund Initiated│ Return Rejected │
│ ↓               └─────────────────┘
│ Refund Completed
│ - Status: Refunded
│ - Amount credited
```

---

## 4.5 Profile Management Flow

### 4.5.1 Dashboard Tab

```
Click "Profile"
    ↓
/profile?tab=dashboard
    ↓
┌─────────────────────────────────────────┐
│  Welcome, [Name]!                       │
├─────────────────────────────────────────┤
│  Quick Stats                            │
│  - Total Orders                         │
│  - Total Spent                          │
│  - Wishlist Items                       │
├─────────────────────────────────────────┤
│  Recent Orders                          │
│  - Order 1 (Status)                     │
│  - Order 2 (Status)                     │
│  - Order 3 (Status)                     │
├─────────────────────────────────────────┤
│  Quick Actions                          │
│  - [View Orders]                        │
│  - [Manage Addresses]                   │
│  - [View Wishlist]                      │
└─────────────────────────────────────────┘
```

### 4.5.2 Orders Tab

```
Click "Orders" in sidebar
    ↓
/profile?tab=orders
    ↓
┌─────────────────────────────────────────┐
│  Order History                          │
│  Same as /orders page                   │
└─────────────────────────────────────────┘
```

### 4.5.3 Addresses Tab

```
Click "Addresses" in sidebar
    ↓
/profile?tab=addresses
    ↓
┌─────────────────────────────────────────┐
│  Saved Addresses                        │
│  ┌─────────────────────────────────────┐│
│  │ Address 1 (Default)                 ││
│  │ Name, Phone                         ││
│  │ Address Line 1                      ││
│  │ Address Line 2                      ││
│  │ City, State, PIN                    ││
│  │ [Edit] [Delete] [Set Default]       ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ Address 2                           ││
│  │ ...                                 ││
│  └─────────────────────────────────────┘│
│  [+ Add New Address]                    │
└─────────────────────────────────────────┘
```

#### Add/Edit Address Flow
```
Click "Add New Address" or "Edit"
    ↓
┌─────────────────────────────────────────┐
│  Address Form                           │
│  - Full Name                            │
│  - Phone Number                         │
│  - Address Line 1                       │
│  - Address Line 2                       │
│  - Landmark (optional)                  │
│  - City                                 │
│  - State                                │
│  - PIN Code                             │
│  - Country                              │
│  [Save Address]                         │
└─────────────────────────────────────────┘
    ↓
Validation
    ↓
┌─────────────────┬─────────────────┐
│ Valid           │ Invalid         │
│ ↓               │ ↓               │
│ Save Address    │ Show Errors     │
│ ↓               └─────────────────┘
│ Update List
│ Toast: Address saved
```

### 4.5.4 Wishlist Tab

```
Click "Wishlist" in sidebar
    ↓
/profile?tab=wishlist
    ↓
┌─────────────────────────────────────────┐
│  Same as /wishlist page                 │
└─────────────────────────────────────────┘
```

### 4.5.5 Settings Tab

```
Click "Settings" in sidebar
    ↓
/profile?tab=settings
    ↓
┌─────────────────────────────────────────┐
│  Profile Settings                       │
│  - Name                                 │
│  - Email                                │
│  - Phone                                │
│  - Profile Picture                      │
├─────────────────────────────────────────┤
│  Change Password                        │
│  - Current Password                     │
│  - New Password                         │
│  - Confirm New Password                 │
├─────────────────────────────────────────┤
│  Notification Preferences               │
│  - Email notifications                  │
│  - SMS notifications                    │
│  - Marketing emails                     │
└─────────────────────────────────────────┘
```

---

## 4.6 Search Flow

```
Click Search Icon
    ↓
┌─────────────────────────────────────────┐
│  Search Input                           │
│  - Type to search                       │
│  - Search by:                           │
│    - Product Name                       │
│    - Brand                              │
│    - Category                           │
│    - SKU                                │
└─────────────────────────────────────────┘
    ↓
Type Query
    ↓
┌─────────────────────────────────────────┐
│  Search Suggestions (debounced)         │
│  - Product matches                      │
│  - Category matches                     │
│  - Brand matches                        │
└─────────────────────────────────────────┘
    ↓
Press Enter or Click Suggestion
    ↓
/products?search=[query]
    ↓
┌─────────────────────────────────────────┐
│  Search Results                         │
│  - "Results for '[query]'"              │
│  - Product count                        │
│  - Filter by category                   │
│  - Sort results                         │
│  - Product grid                         │
└─────────────────────────────────────────┘
```

---

## 4.7 Review Flow

```
Order Status: Delivered
    ↓
Click "Write Review"
    ↓
┌─────────────────────────────────────────┐
│  Review Form                            │
│  - Rating (1-5 stars)                   │
│  - Title (optional)                     │
│  - Comment                              │
│  - Upload Images (optional)             │
│    - Max 5 images                       │
│    - Max 5MB per image                  │
│    - JPG, PNG only                      │
│  [Submit Review]                        │
└─────────────────────────────────────────┘
    ↓
POST /api/customer/reviews
    ↓
┌─────────────────┬─────────────────┐
│ Success         │ Failure         │
│ ↓               │ ↓               │
│ Review Submitted│ Show Error      │
│ ↓               └─────────────────┘
│ Pending Approval
│ ↓
Admin Moderates
    ↓
┌─────────────────┬─────────────────┐
│ Approved        │ Rejected        │
│ ↓               │ ↓               │
│ Visible on      │ Not visible     │
│ product page    │                 │
└─────────────────┴─────────────────┘
```

---

## 4.8 Bulk Order Inquiry Flow

```
Click "Bulk Order"
    ↓
/bulk-order
    ↓
┌─────────────────────────────────────────┐
│  Bulk Order Form                        │
│  - Name                                 │
│  - Email                                │
│  - Phone                                │
│  - Company Name (optional)              │
│  - Product(s)                           │
│  - Quantity                              │
│  - Delivery Date (optional)             │
│  - Additional Notes                     │
│  [Submit Inquiry]                       │
└─────────────────────────────────────────┘
    ↓
POST /api/contact (or dedicated endpoint)
    ↓
┌─────────────────────────────────────────┐
│  Inquiry Submitted                      │
│  - Confirmation email sent              │
│  - Admin notified                       │
└─────────────────────────────────────────┘
```

---

## 4.9 Complete User Flow Diagram

```
New Visitor
    ↓
Home (/)
    ↓
┌─────────────────────────────────────────┐
│  Browse                                 │
│  - Categories                           │
│  - Products                             │
│  - Offers                               │
│  - Search                               │
└─────────────────────────────────────────┘
    ↓
Product Listing (/products)
    ↓
┌─────────────────────────────────────────┐
│  Filter & Sort                          │
│  - Category                             │
│  - Brand                                │
│  - Price                                │
│  - Color                                │
│  - Size                                 │
│  - Rating                               │
└─────────────────────────────────────────┘
    ↓
Product Detail (/products/[slug])
    ↓
┌─────────────────────────────────────────┐
│  View Details                           │
│  - Images                               │
│  - Description                          │
│  - Variants                             │
│  - Price                                │
│  - Reviews                              │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Select Variant                         │
│  Choose Quantity                        │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Add to Cart / Wishlist                 │
│  (Login required)                       │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Cart (/cart)                           │
│  - Review items                         │
│  - Update quantities                    │
│  - Remove items                         │
│  - View summary                         │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Checkout (/checkout)                   │
│  1. Select Address                      │
│  2. Choose Shipping                     │
│  3. Select Payment                      │
│  4. Place Order                         │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Payment                                │
│  - Razorpay (online)                    │
│  - COD                                  │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Order Success (/checkout/success)      │
│  - Order confirmation                   │
│  - Order number                         │
│  - Order details                        │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Order Tracking (/orders/[id])          │
│  - Status timeline                      │
│  - Track shipment                       │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Delivery                               │
│  - Receive order                        │
│  - Check items                          │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Post-Delivery                          │
│  - Write Review                         │
│  - Return (if needed)                   │
│  - Reorder                              │
└─────────────────────────────────────────┘
```

---

## 4.10 Existing vs Required User Flow

### Already Implemented
- ✅ Home page with sections
- ✅ Product listing with filters
- ✅ Product detail with variants
- ✅ Login/Register with OTP
- ✅ Forgot password
- ✅ Wishlist
- ✅ Cart
- ✅ Checkout with Razorpay + COD
- ✅ Order list with search/filter
- ✅ Order detail with cancel
- ✅ Profile with tabs
- ✅ Address management
- ✅ Search
- ✅ Review submission
- ✅ Bulk order inquiry

### Needs Modification
- ⚠️ Order tracking (shipment tracking integration)
- ⚠️ Return request flow (admin approval integration)
- ⚠️ Search suggestions (debounced autocomplete)
- ⚠️ Product detail (multi-attribute variant selection)

### Missing
- ❓ Guest checkout
- ❓ Social login (Google, Facebook)
- ❓ Order tracking page (real-time)
- ❓ Frequently bought together
- ❓ Recently viewed products
- ❓ Recommended products
- ❓ Product comparison
- ❓ Size chart for fashion
- ❓ Share wishlist
- ❓ Reorder functionality
- ❓ Download invoice
- ❓ Notification preferences
- ❓ Reward points display
- ❓ Wallet balance