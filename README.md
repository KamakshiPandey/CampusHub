
# CampusHub - Campus Marketplace

A full-stack MERN + MySQL application for students to buy, sell, rent items, and find roommates — with real-time chat, search/filters, reviews, and an admin dashboard.

## Problem
Students constantly need to sell textbooks, furniture, and bikes when leaving campus, or find a roommate to split rent — but end up scattered across WhatsApp groups and bulletin boards with no structure, search, or trust system.

## Features
- JWT authentication with bcrypt password hashing
- Buy/Sell/Rent listings with image upload, search, filters, sorting, and pagination
- Roommate finder with budget/location filters
- Real-time chat via Socket.io
- Reviews & ratings system for trust between users
- Map-based pickup location picker (Leaflet + OpenStreetMap)
- Recently viewed items, autocomplete search suggestions
- Email notifications (welcome email, new message alerts, view milestone alerts)
- Admin dashboard: manage users, ban/unban, moderate listings
- Rate limiting, input validation, security headers (helmet)

## Tech Stack
**Frontend:** React, React Router, Tailwind CSS, Framer Motion, Socket.io-client, Leaflet
**Backend:** Node.js, Express, Sequelize ORM, MySQL, Socket.io, JWT, Nodemailer
**Security:** bcrypt, helmet, express-rate-limit, express-validator

## Project Structure
\`\`\`
campus-marketplace/
├── client/          # React frontend
└── server/          # Express + MySQL backend
\`\`\`

## Getting Started

### Backend
\`\`\`
cd server
npm install
# create a .env file (see .env.example)
npm run dev
\`\`\`

### Frontend
\`\`\`
cd client
npm install
npm start
\`\`\`

## Environment Variables
See \`server/.env.example\` and \`client/.env.example\` for required variables.
