# ShopEasy - Simple Full-Stack E-Commerce Web Application

A clean, beginner-friendly, and fully functional full-stack e-commerce project built for college academic evaluations.

---

## Technical Stack

* **Frontend:** React.js, Vite, Vanilla CSS, React Router, Context API, Axios, Lucide React (Icons).
* **Backend:** Node.js, Express.js, JWT Authentication, bcryptjs (Password Hashing).
* **Database:** MongoDB, Mongoose ODM.

---

## Project Structure

```
ecommerce-project/
├── backend/
│   ├── middleware/       # Route authorization and security gates
│   │   └── auth.js
│   ├── models/           # Mongoose Database Schemas (User, Product, Cart, Order)
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/           # REST API Route controllers
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── products.js
│   ├── package.json      # Node.js backend configuration and packages
│   ├── seed.js           # Database reset & initial catalog loading script
│   └── server.js         # Backend server entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Shareable UI widgets (Navbar, guards, cards)
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/      # Auth context & Shopping cart context managers
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/        # Route views (Home, Products, Admin, Checkout etc)
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ManageOrders.jsx
│   │   │   ├── ManageProducts.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Products.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx       # Layout shell and react-router declarations
│   │   ├── index.css     # Global CSS design tokens and core styling rules
│   │   └── main.jsx      # React entrypoint mounting node
│   ├── package.json      # Vite application configurations
│   └── vite.config.js
├── README.md
└── .env                  # Environment configurations reference
```

---

## Setup & Running Guide

### Prerequisites
1. Install **Node.js** (v16+ recommended).
2. Install and start **MongoDB** locally, or set up a MongoDB Atlas cloud database.

---

### Step 1: Backend Setup & Seeding

1. Open a terminal inside the `backend` folder.
2. If not already done, install backend dependencies:
   ```bash
   npm install
   ```
3. (Optional) Adjust the environment values in `backend/.env`.
4. Run the database seed script to populate sample products and test accounts:
   ```bash
   node seed.js
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs by default on port `5000`.*

---

### Step 2: Frontend Setup

1. Open a new terminal inside the `frontend` folder.
2. If not already done, install frontend packages:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *By default, this launches at `http://localhost:5173`.*

---

## Demo Test Accounts

The seed script initializes two profiles to bypass manual registration:

| Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Standard User** | `user@example.com` | `user123` | Browsing, details, cart adjustments, placing orders, order history. |
| **Administrator** | `admin@example.com` | `admin123` | Dashboard analytics, catalog management (CRUD products), updating order status. |
