
# 🎓 CampusHub : Campus Marketplace & Roommate Finder

A full-stack **MERN + MySQL** web application built for students to buy, sell, or rent items within their campus community, and to find roommates — with real-time chat, map-based location picking, reviews, and an admin dashboard.

## 📌 The Problem

Every semester, students end up scattered across WhatsApp groups, Instagram stories, and physical bulletin boards trying to sell textbooks, furniture, or bicycles before leaving campus — or trying to find a roommate to split rent. There's no central place with search, filters, trust signals, or direct messaging built for this specific need. CampusHub solves that by giving students one dedicated platform.

## ✨ Features

### Core Marketplace
- Post items for **sale or rent** with images, category, condition, and price
- **Search, filter, and sort** listings (by category, price range, type, newest/oldest)
- **Autocomplete search suggestions** as you type
- **Recently viewed** items tracked locally per user
- **Pagination** for browsing large result sets

### Roommate Finder
- Post roommate-wanted listings with budget, location, move-in date, and gender preference
- Dedicated detail page with direct messaging to the poster

### Location & Maps
- **Interactive map picker** (Leaflet + OpenStreetMap) to set a pickup location by clicking or searching an address
- Listing detail pages display the pickup location on an embedded map

### Real-Time Communication
- **Socket.io-powered live chat** between buyers and sellers
- Chat history persisted in MySQL
- Email notification sent to a user when they receive a new message

### Trust & Reputation
- **Reviews & star ratings** — buyers can rate sellers after interacting with them
- Public user profile pages showing average rating and review history

### Notifications
- Welcome email on signup
- New message email alerts
- **View milestone emails** — sellers get notified when their listing hits 10 / 25 / 50 / 100+ views

### Analytics
- Seller dashboard showing total listings, total views, and items sold/rented
- Per-listing view counter

### Admin Dashboard
- Platform-wide stats (total users, listings, roommate posts, banned users)
- View, ban/unban, or delete any user
- Moderate and remove any listing or roommate post

### Security & Reliability
- JWT authentication with bcrypt password hashing
- Input validation on all forms (express-validator)
- Rate limiting on auth and API routes
- Security headers via Helmet
- Centralized error handling with clean JSON error responses
- Protected frontend routes (redirect to login if not authenticated)

### UI/UX
- Fully responsive, professional design system built with Tailwind CSS
- Smooth page transitions and micro-interactions (Framer Motion)
- Toast notifications for every user action
- Skeleton loading states instead of plain "Loading..." text
- Friendly empty states with call-to-action buttons
- Custom 404 page

## 🛠️ Tech Stack

**Frontend**
- React (Create React App)
- React Router v6
- Tailwind CSS
- Framer Motion (animations)
- Axios
- Socket.io-client
- React Leaflet (maps)
- React Hot Toast (notifications)
- React Icons

**Backend**
- Node.js + Express
- MySQL with Sequelize ORM
- Socket.io (real-time chat)
- JWT (jsonwebtoken) for auth
- bcryptjs for password hashing
- Multer for image uploads
- Nodemailer for email notifications
- express-validator, helmet, express-rate-limit, morgan, cors

## 📁 Folder Structure



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
│   │   │   └── AuthContext.js     # Global auth state (login/register/logout)
│   │   │
│   │   ├── utils/
│   │   │   ├── api.js             # Axios instance with JWT interceptor
│   │   │   ├── constants.js       # Env-based URLs (API, sockets, uploads)
│   │   │   └── recentlyViewed.js  # localStorage helper
│   │   │
│   │   ├── App.js                 # Routes + layout
│   │   ├── index.js
│   │   └── index.css              # Tailwind + custom design tokens
│   │
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
│
├── server/                        # Express backend
│   ├── config/
│   │   └── db.js                  # Sequelize MySQL connection
│   │
│   ├── models/                    # Sequelize models
│   │   ├── User.js
│   │   ├── Listing.js
│   │   ├── Roommate.js
│   │   ├── Chat.js
│   │   ├── Message.js
│   │   ├── Review.js
│   │   └── index.js                # Associations + sync
│   │
│   ├── controllers/                # Route handler logic
│   │   ├── authController.js
│   │   ├── listingController.js
│   │   ├── roommateController.js
│   │   ├── chatController.js
│   │   ├── adminController.js
│   │   └── reviewController.js
│   │
│   ├── routes/                     # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── listingRoutes.js
│   │   ├── roommateRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── adminRoutes.js
│   │   └── reviewRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification + ban check
│   │   ├── adminMiddleware.js      # Admin-only guard
│   │   ├── uploadMiddleware.js     # Multer image upload config
│   │   ├── validators.js           # express-validator rule sets
│   │   └── errorMiddleware.js      # 404 + centralized error handler
│   │
│   ├── sockets/
│   │   └── socketHandler.js        # Socket.io real-time chat + email trigger
│   │
│   ├── utils/
│   │   └── mailer.js               # Nodemailer email sender
│   │
│   ├── uploads/                    # Uploaded listing/roommate images (gitignored)
│   ├── server.js                   # App entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md



## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server running locally
- A Gmail account (optional, for email notifications)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/campus-marketplace.git
cd campus-marketplace
\`\`\`

### 2. Set up the database
\`\`\`bash
mysql -u root -p -e "CREATE DATABASE campus_marketplace;"
\`\`\`

### 3. Backend setup
\`\`\`bash
cd server
npm install
copy .env.example .env
# edit .env with your MySQL credentials, JWT secret, and (optional) email credentials
npm run dev
\`\`\`

### 4. Frontend setup
\`\`\`bash
cd client
npm install
copy .env.example .env
npm start
\`\`\`

The app will be available at \`http://localhost:3000\`, with the API running at \`http://localhost:5000\`.

## 🔐 Environment Variables

**server/.env**
\`\`\`
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=campus_marketplace
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
\`\`\`

**client/.env**
\`\`\`
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_UPLOADS_URL=http://localhost:5000
\`\`\`

## 📸 Screenshots
_Add screenshots or a demo GIF here once your app is running._

## 🗺️ Roadmap / Future Improvements
- Favorites/wishlist system
- Multiple images per listing (gallery)
- Real-time unread message badge
- Report/flag inappropriate listings
- Deploy to production (Render/Railway + Vercel + Cloudinary for image storage)

## 📄 License
This project is for educational/portfolio purposes.
