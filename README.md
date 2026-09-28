# 🛒 ShopEase — Full-Stack E-Commerce Web Application

<p align="center">
  <strong>A modern full-stack e-commerce web application built with React, Node.js, Express and MongoDB.</strong>
</p>

<p align="center">
  Product Catalog • Search • Category Filter • Cart • Checkout • Authentication • Orders • REST API
</p>

---

## 📌 Project Overview

**ShopEase** is a full-stack e-commerce web application developed as an internship project.

The application provides a complete shopping workflow where users can browse products, search and filter products, view product details, manage a shopping cart, register and login, place orders, and view their order history.

The frontend is built using **React + Vite**, while the backend uses **Node.js + Express** with **MongoDB** as the database.

---

## ✨ Features

### 🛍️ Product Catalog
- Dynamic product listing
- Product name, description, price, category and stock
- Product details page
- Product-specific images

### 🔎 Search & Category Filter
- Search products by name
- Search products by description
- Filter products by category
- Combined search and category filtering

### 🛒 Shopping Cart
- Add products to cart
- Increase/decrease quantity
- Remove products
- Automatic subtotal calculation
- Automatic total calculation
- Checkout workflow

### 👤 Authentication
- User registration
- User login
- Password hashing using bcryptjs
- JWT-based authentication
- Protected APIs

### 📦 Orders
- Place orders
- Store orders in MongoDB
- View order history
- Track order status
- User-specific orders

---

# 🧱 Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Frontend development/build tool |
| JavaScript | Application logic |
| CSS | Styling |
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin communication |
| dotenv | Environment variables |

---

# 🏗️ Application Architecture

```text
User
  │
  ▼
React + Vite Frontend
  │
  │ HTTP / REST API
  ▼
Node.js + Express Backend
  │
  ├── Authentication API
  ├── Product API
  └── Order API
  │
  ▼
MongoDB Atlas
  ├── Users
  ├── Products
  └── Orders
```

---

# 📁 Project Structure

```text
ecommerce-web-app/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── server/
│   ├── models/
│   │   ├── User.cjs
│   │   ├── Product.cjs
│   │   └── Order.cjs
│   ├── routes/
│   │   ├── auth.cjs
│   │   ├── products.cjs
│   │   └── orders.cjs
│   ├── server.cjs
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

---

# 🔌 REST API

## Authentication

### Register
```http
POST /api/auth/register
```

### Login
```http
POST /api/auth/login
```

Example:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Products

### Get All Products
```http
GET /api/products
```

### Get Product by ID
```http
GET /api/products/:id
```

### Create Product
```http
POST /api/products
```

## Orders

### Create Order
```http
POST /api/orders
```

### Get User Orders
```http
GET /api/orders
```

### Get Specific Order
```http
GET /api/orders/:id
```

Protected requests use:

```http
Authorization: Bearer <token>
```

---

# 🔐 Environment Variables

Create this file locally:

```text
server/.env
```

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> **Important:** Never upload `.env` or database credentials to GitHub. The `.gitignore` file is used to keep sensitive environment files out of the repository.

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/mohitsonawane21/ecommerce-web-app.git
cd ecommerce-web-app
```

## 2. Install Frontend Dependencies

```bash
npm install
```

## 3. Install Backend Dependencies

```bash
cd server
npm install
```

## 4. Configure Environment Variables

Create:

```text
server/.env
```

Add your MongoDB connection string and JWT secret.

## 5. Start Backend

Inside the `server` folder:

```bash
node server.cjs
```

Backend:

```text
http://localhost:5000
```

## 6. Start Frontend

Open another terminal:

```bash
cd ecommerce-web-app
npm run dev
```

Frontend normally runs at:

```text
http://localhost:5173
```

---

# 🔄 Application Workflow

```text
Open Website
     ↓
Browse Products
     ↓
Search / Filter Products
     ↓
View Product Details
     ↓
Add Product to Cart
     ↓
Update Cart
     ↓
Login / Register
     ↓
Checkout
     ↓
Place Order
     ↓
Order Saved in MongoDB
     ↓
View My Orders
```

---

# 🗄️ Database Models

### User

```text
name
email
password
createdAt
updatedAt
```

### Product

```text
name
description
price
category
image
stock
createdAt
updatedAt
```

### Order

```text
user
items
totalAmount
status
createdAt
updatedAt
```

---

# 🛡️ Security

The project includes:

- Password hashing with bcryptjs
- JWT authentication
- Protected order APIs
- Environment variables for secrets
- `.env` excluded from Git
- User-specific order access
- CORS configuration

> This is an internship/learning project. Additional security hardening would be required before production deployment.

---

# 📊 Core Modules

| Module | Status |
|---|---|
| Product Catalog | ✅ Completed |
| Product Details | ✅ Completed |
| Product Search | ✅ Completed |
| Category Filtering | ✅ Completed |
| Shopping Cart | ✅ Completed |
| Checkout | ✅ Completed |
| Order Placement | ✅ Completed |
| My Orders | ✅ Completed |
| User Registration | ✅ Completed |
| User Login | ✅ Completed |
| JWT Authentication | ✅ Completed |
| MongoDB Integration | ✅ Completed |
| REST APIs | ✅ Completed |
| Backend Server | ✅ Completed |

---

# 🚧 Future Enhancements

- Online payment gateway
- Admin dashboard
- Product management
- Inventory management
- Product reviews and ratings
- Wishlist
- User profile management
- Password reset
- Email notifications
- Image upload system
- Pagination
- Advanced filtering and sorting
- Automated testing
- Production deployment
- CI/CD pipeline

---

# 🎯 Project Objectives

This project demonstrates practical knowledge of:

1. Full-stack web development
2. React frontend development
3. Node.js and Express backend development
4. REST API development
5. MongoDB database integration
6. JWT authentication
7. Password security
8. Shopping cart implementation
9. Order management
10. Full-stack application architecture

---

# 👨‍💻 Developed By

## **Mohit Sonawane**

**Developer:** Mohit Sonawane

**Project:** ShopEase — Full-Stack E-Commerce Web Application

**GitHub:**  
https://github.com/mohitsonawane21

**Repository:**  
https://github.com/mohitsonawane21/ecommerce-web-app

---

# 📄 Project Information

| Information | Details |
|---|---|
| Project Name | ShopEase |
| Project Type | Full-Stack E-Commerce Web Application |
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Authentication | JWT |
| Password Security | bcryptjs |
| API Style | REST |
| Developer | Mohit Sonawane |

---

# ⭐ Acknowledgement

This project was developed as part of a full-stack development internship task to demonstrate practical implementation of frontend development, backend development, REST APIs, database integration, authentication, and e-commerce functionality.

---

<p align="center">
  <strong>Developed by Mohit Sonawane</strong>
</p>

<p align="center">
  Built with ❤️ using React, Node.js, Express and MongoDB.
</p>
