# StudyStuff — Full Stack E-Commerce Platform

## Overview

StudyStuff is a full-stack e-commerce platform designed specifically for college students to purchase stationery and everyday essentials. It supports three roles (Buyer, Seller and Admin), Razorpay payments, seller onboarding with admin approval, and dashboards for sellers and admins.

---

## Features

**Authentication & Authorization**
- JWT-based authentication (tokens valid for 1 day)
- Passwords hashed with bcrypt
- Role-based access control for Buyers, Sellers and Admins
- Admin accounts cannot be created through public signup
- New sellers start unapproved and can only manage products after an admin approves them

**Buyer Features**
- Browse products with search, category, price and rating filters, and sorting
- Cart (stored in the browser) and wishlist
- Checkout with an Indian state / district picker
- Saved addresses on the profile page
- Razorpay payment with server-side signature verification
- Order history and order details page
- Product reviews with ratings and "helpful" votes

**Seller Dashboard**
- Add, update and delete their own products
- Monthly sales analytics (revenue and units sold per product)
- View orders that contain their products and update order status
- Generate packing slips as PDFs (jsPDF)

**Admin Dashboard**
- Platform stats: users, products, orders, revenue, orders today, revenue this month
- Sales chart for the last 7 days and top-selling products (Recharts)
- View users, orders and products with pagination
- Delete products and add categories
- Approve pending sellers
- Command palette (cmdk) to search users, products and orders

**UI**
- Responsive design with Tailwind CSS
- Animations and page transitions with Framer Motion
- Toast notifications (Sonner)
- Custom 404 and error pages

---

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- JavaScript
- Tailwind CSS v4
- Framer Motion
- Recharts
- Radix UI, cmdk, Lucide icons
- jsPDF

### Backend
- Node.js
- Express 5

### Database & ORM
- PostgreSQL
- Prisma ORM

### Authentication
- JWT (JSON Web Tokens)
- bcrypt

### Payments
- Razorpay

---

## System Architecture

The application follows a modular full-stack architecture:

- **Frontend (`frontend/`, Next.js)** handles UI and user interactions and calls the backend through `NEXT_PUBLIC_API_URL`
- **Backend (`backend/`, Express)** is split into feature modules, each with its own `route.js`, `controller.js` and `service.js`
- **Database (PostgreSQL)** stores users, addresses, products, categories, orders, order status history, wishlists and reviews
- **Prisma ORM** defines the schema and migrations in `backend/prisma/`

### Backend Modules

| Module | Base route | Purpose |
|---|---|---|
| auth | `/api/auth` | Register and login |
| user | `/api/users` | Profile and saved addresses |
| products | `/api/products` | Product listing, search and filters; seller product management |
| categories | `/api/categories` | List categories; admins can add new ones |
| orders | `/api/orders` | Place orders and view order history |
| payment | `/api/payment` | Create Razorpay orders and verify payments |
| wishlist | `/api/wishlist` | Toggle and view wishlist items |
| reviews | `/api/reviews` | Add, edit, delete and upvote reviews |
| seller | `/api/seller` | Seller analytics, orders and status updates |
| admin | `/api/admin` | Stats, users, orders, products, seller approval, search |

---

## Key Functionalities

### Buyer Flow
1. Sign up / Login
2. Browse and filter products
3. Add items to cart or wishlist
4. Enter a shipping address and pay with Razorpay
5. The backend verifies the payment signature, creates the order and reduces stock
6. Track orders and leave reviews

### Seller Flow
1. Sign up as a Seller
2. Wait for admin approval
3. Add and manage products
4. View sales analytics and incoming orders
5. Update order status and print packing slips

### Admin Flow
1. Login as Admin (created by the seed script)
2. Review platform stats and sales charts
3. Approve pending sellers
4. Manage users, orders, products and categories
5. Search across the platform with the command palette

---

## Installation & Setup

### Prerequisites
- Node.js 20.9+ (required by Next.js 16)
- PostgreSQL database
- Razorpay account (test keys work)

### 1. Clone the repository

```bash
git clone https://github.com/ganga-300/E-commerce-platform-BE.git
cd E-commerce-platform-BE
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/studystuff
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose_a_password
PORT=8000
```

Run the migrations, seed the admin account and sample products, then start the server:

```bash
npx prisma migrate dev
node prisma/seed.js
npm run dev
```

The API runs at `http://localhost:8000`.

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Learnings

- Built a modular full-stack architecture with separate route, controller and service layers
- Implemented secure authentication, role-based access and a seller approval workflow
- Integrated a real-world payment gateway with signature verification
- Improved understanding of API design, relational data modelling and database migrations

---

## Future Improvements

- Store the cart in the database so it syncs across devices
- Implement a recommendation system
- Email notifications for order status changes
- Automated tests for the backend API

---

## Contributing

Contributions are welcome. Feel free to fork the repo and submit a PR.

---

## Contact

**Ganga Raghuwanshi**
Email: [ganga.raghuwanshi2024@nst.rishihood.edu.in](mailto:ganga.raghuwanshi2024@nst.rishihood.edu.in)

---

## If you like this project

Consider giving it a star on GitHub.
