# ShopSphere — Production-Ready Full-Stack E-Commerce Web Application

**ShopSphere** is a modern, high-performance, full-stack e-commerce platform built with **React 19**, **TypeScript**, **Express**, and **MySQL 8.0** architecture. It features a curated digital storefront, role-based access control (Admin & Customer), atomic database transactions for inventory locking, server-authoritative checkout calculations, and live order status timeline tracking.

Designed and developed for an internship presentation, university evaluation, and portfolio demonstration.

---
## 🌐 Live Demo

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=netlify&logoColor=white)]([YOUR_DEPLOYED_WEBSITE_URL](https://task-3-e-commerce-web-application.onrender.com
))

**🔗 Website:** [View Live Demo](YOUR_DEPLOYED_WEBSITE_URL)
---
## 1. Key Features

### Storefront & Catalog
- **Responsive Catalog:** Browse 20+ authentic products across 5 categories (Audio & Wearables, Electronics, Fashion & Apparel, Home & Living, Accessories).
- **Search & Multi-Filtering:** Real-time search with debounce, category filtering, min/max price sliders, and in-stock toggle.
- **Dynamic Sorting:** Sort products by newest arrivals, price (low-to-high, high-to-low), and alphabetical order.
- **Deep Product Details:** Full technical specifications, stock counters, dynamic image handling, and related product recommendations.

### Shopping Bag & Transactional Checkout
- **Real-Time Cart Drawer & Page:** Persistent shopping cart with quantity stepper, stock-capped quantity limits, and subtotal calculation.
- **Authoritative Totals:** The server computes line totals, taxes, and shipping rates ($0 for orders ≥ $100, $9.99 standard).
- **Safe Stock Reductions:** Order placement executes within transactional inventory locks, deducting stock atomically.
- **Honest Payment Options:** Clearly labelled **Cash on Delivery** and **Demo Presentation Checkout** (no fake credit card capture).

### Customer Accounts & Order Tracking
- **Authentication:** Secure signup and login with bcrypt (10 salt rounds) and JSON Web Tokens.
- **Order Tracking Timeline:** Visual progression through `Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`.
- **Customer Cancellation:** Orders in `Pending` or `Confirmed` status can be cancelled by the customer, which **automatically restores reserved inventory** back to stock.
- **Audit History:** Full log of status changes and administrative fulfillment notes.

### Administrative Control Center (`/admin`)
- **Executive Analytics:** Real-time cards calculating Total Catalog Products, Registered Users, Lifetime Orders, Pending Orders, and **Net Revenue (strictly excluding cancelled orders)**.
- **Product Management:** Add new items, edit details, adjust prices, restock quantities, and delete/archive products with relational integrity protection.
- **Order Management:** View all customer invoices, filter by status, and update shipment progression with notes.
- **User Management:** Manage customer accounts and toggle active status with safety guards preventing accidental deactivation of the last active administrator.
- **Database Status:** Live monitor indicating connection engine (MySQL 8.0 server or embedded relational engine).

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7, Lucide Icons |
| **Backend** | Node.js, Express.js, TypeScript, TSX, Cookie-Parser, CORS |
| **Database** | MySQL 8.0 (`mysql2/promise` pool with transactions) + Embedded Relational Engine fallback |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing, Zod schema validation |
| **Package Manager** | npm |

---

## 3. Architecture & Data Flow

```text
  [ React 19 Frontend SPA ]
          │
          │  RESTful JSON API with Credentials (Cookie / Bearer Token)
          ▼
   [ Express Backend Server (server.ts) ]
          │
   ├── JWT Auth Middleware (requireAuth, requireAdmin)
   ├── Zod Input Validation
   └── Unified Database Layer (src/server/db)
          ├── MySQL 8.0 Pool (mysql2) [when configured]
          └── Embedded Relational Store [preview container fallback]
```

---

## 4. Project Folder Structure

```text
├── database/
│   ├── schema.sql           # MySQL 8.0 DDL script (tables, foreign keys, indexes)
│   └── seed.sql             # Realistic seed data (categories, products, demo users)
├── src/
│   ├── components/
│   │   ├── admin/           # AdminLayout, admin navigation
│   │   ├── cart/            # CartDrawer sliding drawer
│   │   ├── common/          # StatusBadge, ConfirmModal, ProtectedRoute
│   │   ├── layout/          # Navbar, Footer
│   │   └── products/        # ProductCard, ProductFilters
│   ├── context/
│   │   ├── AuthContext.tsx  # User state, JWT sessions, demo login helpers
│   │   ├── CartContext.tsx  # Cart items, live badge, total calculations
│   │   └── ToastContext.tsx # Non-blocking alert notifications
│   ├── pages/
│   │   ├── admin/           # AdminDashboardPage, AdminProductsPage, AdminOrdersPage, AdminUsersPage
│   │   ├── AccountPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── OrderConfirmationPage.tsx
│   │   ├── OrderTrackingPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ShopPage.tsx
│   ├── server/
│   │   ├── config/          # Environment configuration
│   │   ├── db/              # MySQL client & embedded relational store
│   │   ├── middleware/      # Auth & Error handling
│   │   ├── routes/          # auth, products, cart, orders, admin, health
│   │   ├── validators/      # Zod validation schemas
│   │   └── app.ts           # Express app definition
│   ├── services/
│   │   └── api.ts           # Type-safe client API wrapper
│   ├── types/
│   │   └── index.ts         # Shared TypeScript interfaces
│   ├── App.tsx              # React Router definitions
│   ├── index.css            # Tailwind CSS 4 theme
│   └── main.tsx             # React entry point
├── .env.example             # Safe environment variable template
├── metadata.json            # App metadata configuration
├── package.json
├── server.ts                # Full-stack server entry point (port 3000)
├── tsconfig.json
└── vite.config.ts
```

---

## 5. Quick Demonstration & Evaluation Accounts

ShopSphere includes pre-seeded demonstration accounts and **one-click evaluator fast-login buttons** on the Login page and mobile menu:

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Administrator** | `admin@shopsphere.com` | `Admin@123` | Full access to `/admin` dashboard, catalog management, order fulfillment, and user accounts. |
| **Customer** | `customer@shopsphere.com` | `Customer@123` | Browsing, cart, checkout, and order tracking on `/account`. |

---

## 6. Local Setup & Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MySQL 8.0 (Optional — the app automatically runs smoothly with embedded relational persistence if an external MySQL instance is not running).

### Step 1: Clone and Install Dependencies
```bash
git clone https://github.com/your-username/shopsphere.git
cd shopsphere
npm install
```

### Step 2: Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your configuration:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-random-production-jwt-secret-key-32-chars-long
JWT_EXPIRES_IN=7d

# MySQL 8.0 Settings (optional)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=shopsphere_db
```

### Step 3: MySQL 8.0 Database Setup (When using MySQL)
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p shopsphere_db < database/seed.sql
```

### Step 4: Run Application
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 7. API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | System health & DB connection status | Public |
| `POST` | `/api/auth/register` | Register customer account | Public |
| `POST` | `/api/auth/login` | Authenticate user & get JWT token | Public |
| `POST` | `/api/auth/logout` | Clear session cookie | Public |
| `GET` | `/api/auth/me` | Current session user | Customer / Admin |
| `GET` | `/api/categories` | List all categories | Public |
| `GET` | `/api/products` | Filter, search & paginate catalog | Public |
| `GET` | `/api/products/:id` | Get single product by ID or slug | Public |
| `GET` | `/api/cart` | Get shopping cart items & subtotal | Public / Session |
| `POST` | `/api/cart/items` | Add product with stock validation | Public / Session |
| `PATCH`| `/api/cart/items/:id`| Update cart item quantity | Public / Session |
| `DELETE`|`/api/cart/items/:id`| Remove cart item | Public / Session |
| `DELETE`|`/api/cart` | Empty shopping bag | Public / Session |
| `POST` | `/api/orders` | Place order with stock locks | Public / Session |
| `GET` | `/api/orders/my` | View personal order history | Customer |
| `GET` | `/api/orders/:id` | View specific order & status timeline | Customer / Admin |
| `POST` | `/api/orders/:id/cancel` | Cancel pending order & restore stock | Customer |
| `GET` | `/api/admin/dashboard` | Fetch executive KPI statistics | Admin |
| `GET` | `/api/admin/products` | View catalog (including inactive) | Admin |
| `POST` | `/api/admin/products` | Add new catalog product | Admin |
| `PUT` | `/api/admin/products/:id`| Update product details | Admin |
| `DELETE`|`/api/admin/products/:id`| Remove or archive product | Admin |
| `GET` | `/api/admin/orders` | List customer orders | Admin |
| `PATCH`| `/api/admin/orders/:id/status`| Update order status & notes | Admin |
| `GET` | `/api/admin/users` | List registered accounts | Admin |
| `PATCH`| `/api/admin/users/:id/status`| Activate or deactivate accounts | Admin |

---

## 8. Verification & QA Checklist

- [x] Responsive layout tested for Desktop, Tablet, and Mobile viewport sizes.
- [x] Real-time category filtering, price range filter, and text search working.
- [x] Product detail pages showing dynamic inventory counters and related products.
- [x] Shopping cart stepper enforcing minimum (1) and maximum available stock.
- [x] Server-authoritative checkout calculating shipping and locking inventory.
- [x] Order history displaying actual customer orders.
- [x] Order timeline accurately visualizing status progression.
- [x] Cancelling orders restores quantities back to catalog stock.
- [x] Admin dashboard calculating net revenue strictly from non-cancelled orders.
- [x] Admin product management supporting create, edit, delete/archive with validation.
- [x] Admin order status updater writing to audit history.
- [x] Admin user management protecting against deactivating the last administrator.
- [x] Complete MySQL 8.0 `schema.sql` and `seed.sql` provided.
