# 🎓 CampusHub : Campus Marketplace & Roommate Finder

A full-stack **MERN + MySQL** web application built for students to **buy, sell, or rent items within their campus community** and **find compatible roommates** , all in one centralized platform with real-time chat, maps, analytics, and trust-based features.

---

## 🚀 Overview

CampusHub is designed to simplify campus life by providing a **dedicated digital marketplace and roommate finder**. It eliminates the need for scattered communication across WhatsApp groups, Instagram posts, and physical notice boards.

The platform ensures:

* Centralized listings
* Real-time communication
* Location-based interactions
* Trust and transparency

---

## 📌 Problem Statement

Students often face challenges such as:

* No centralized platform for buying/selling items
* Difficulty finding trustworthy roommates
* Fragmented communication across multiple platforms
* Lack of credibility (no ratings or reviews)
* No structured search/filter system

---

## 💡 Solution

CampusHub provides a **complete ecosystem** that includes:

* Marketplace for buying/selling/renting
* Roommate discovery platform
* Real-time chat system
* Map-based location selection
* Reviews and ratings
* Admin moderation system

---

## ✨ Features

### 🛒 Core Marketplace

* Create listings for **sale or rent**
* Upload item images with:

  * Price
  * Category
  * Condition
* Advanced **search, filter, and sorting**
* **Autocomplete search suggestions**
* **Pagination** for large datasets
* **Recently viewed items** (stored locally)

---

### 🏠 Roommate Finder

* Post roommate listings with:

  * Budget
  * Preferred location
  * Move-in date
  * Gender preference
* Dedicated detail page
* Direct messaging with listing owner

---

### 🗺️ Location & Maps

* Interactive **map picker (Leaflet + OpenStreetMap)**
* Click or search location
* Display pickup location on listing page

---

### 💬 Real-Time Chat

* Built using **Socket.io**
* Instant messaging between users
* Chat history stored in MySQL
* Email notification for new messages

---

### ⭐ Trust & Reputation

* Users can leave **ratings and reviews**
* Public profiles display:

  * Average rating
  * Review history

---

### 🔔 Notifications

* Welcome email on signup
* New message email alerts
* Listing view milestone alerts (10 / 25 / 50 / 100+)

---

### 📊 Analytics Dashboard

* Track:

  * Total listings
  * Total views
  * Items sold/rented
* Per-listing analytics

---

### 🛡️ Admin Dashboard

* Platform-wide stats:

  * Users
  * Listings
  * Roommate posts
* User management:

  * Ban/unban users
* Content moderation

---

### 🔐 Security & Reliability

* JWT Authentication
* Password hashing (bcrypt)
* Input validation (express-validator)
* Rate limiting
* Helmet security headers
* Centralized error handling
* Protected frontend routes

---

### 🎨 UI/UX Highlights

* Fully responsive (Tailwind CSS)
* Smooth animations (Framer Motion)
* Toast notifications
* Skeleton loaders
* Friendly empty states
* Custom 404 page

---

## 🛠️ Tech Stack

### Frontend

* React (Create React App)
* React Router v6
* Tailwind CSS
* Framer Motion
* Axios
* Socket.io-client
* React Leaflet
* React Hot Toast
* React Icons

---

### Backend

* Node.js + Express
* MySQL + Sequelize ORM
* Socket.io
* JWT Authentication (jsonwebtoken)
* bcryptjs
* Multer (file uploads)
* Nodemailer (email notifications)
* express-validator
* helmet
* express-rate-limit
* morgan
* cors

---

## 📁 Folder Structure

```
campus-marketplace/
│
├── client/                        # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── Skeleton.js
│   │   │   ├── StarRating.js
│   │   │   ├── RecentlyViewed.js
│   │   │   ├── LocationPickerModal.js
│   │   │   └── ListingMap.js
│   │   │
│   │   ├── pages/                 # Route-level pages
│   │   │   ├── Home.js
│   │   │   ├── Listings.js
│   │   │   ├── ListingDetail.js
│   │   │   ├── Roommates.js
│   │   │   ├── RoommateDetail.js
│   │   │   ├── CreateListing.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   ├── UserProfile.js
│   │   │   ├── Chats.js
│   │   │   └── NotFound.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   │
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── constants.js
│   │   │   └── recentlyViewed.js
│   │   │
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   │
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
│
├── server/                        # Express backend
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Listing.js
│   │   ├── Roommate.js
│   │   ├── Chat.js
│   │   ├── Message.js
│   │   ├── Review.js
│   │   └── index.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── listingController.js
│   │   ├── roommateController.js
│   │   ├── chatController.js
│   │   ├── adminController.js
│   │   └── reviewController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── listingRoutes.js
│   │   ├── roommateRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── adminRoutes.js
│   │   └── reviewRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   ├── validators.js
│   │   └── errorMiddleware.js
│   │
│   ├── sockets/
│   │   └── socketHandler.js
│   │
│   ├── utils/
│   │   └── mailer.js
│   │
│   ├── uploads/
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+)
* MySQL installed and running
* Gmail account (optional, for email notifications)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/campus-marketplace.git
cd campus-marketplace
```

---

### 2. Setup Database

```bash
mysql -u root -p -e "CREATE DATABASE campus_marketplace;"
```

---

### 3. Backend Setup

```bash
cd server
npm install
copy .env.example .env
# Update .env with your credentials
npm run dev
```

---

### 4. Frontend Setup

```bash
cd client
npm install
copy .env.example .env
npm start
```

---

## 🌐 Application URLs

* Frontend → http://localhost:3000
* Backend → http://localhost:5000

---

## 🔐 Environment Variables

### server/.env

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=campus_marketplace
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

---

### client/.env

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_UPLOADS_URL=http://localhost:5000
```

---

## 📈 Future Improvements

* Wishlist / Favorites system
* Multiple image uploads (gallery view)
* Real-time unread message badge
* Report/flag inappropriate listings
* Deployment (Vercel + Render + Cloudinary)

---

## 📄 License

This project is intended for **educational and portfolio purposes only**.
