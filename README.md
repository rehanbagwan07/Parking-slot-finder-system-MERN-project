# Parking-slot-finder-system-MERN-project
A full-stack MERN web app for real-time parking slot booking in Solapur city with live map, JWT auth, admin panel, and Socket.io updates.

# 🅿️ ParkWise — Smart Parking Slot Finder System
### Built for Solapur City | MERN Stack Project

## 📌 Problem Statement
In busy areas like Solapur, people waste valuable time
searching for available parking. There is no real-time
system to check slot availability or reserve in advance.

## 💡 Solution
ParkWise is a full-stack web application that allows users
to find, view, and book parking slots in real-time across
12 locations in Solapur city.

## ⚙️ Tech Stack
| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js, Axios, Socket.io-client |
| Backend   | Node.js, Express.js, Socket.io    |
| Database  | MongoDB, Mongoose                 |
| Auth      | JWT (JSON Web Token), bcrypt      |
| Real-time | Socket.io                         |
| Hosting   | MongoDB Atlas (Cloud DB)          |

## 🔑 Features
### 👤 User Side
- Signup / Login with JWT Authentication
- View all 12 Solapur parking locations on live map
- See available vs reserved vs occupied slots
- Book a parking slot with start & end time
- Cancel booking anytime
- View full booking history

### 🅿️ Parking System Logic
- Total slots per location
- Real-time slot status: Available / Reserved / Occupied
- Time-based booking (start time & end time)
- Auto amount calculation (hours × price per hour)

### 🛠️ Admin Panel
- Add / manage parking locations
- Add or remove slots
- View all bookings across all users
- Update slot status manually
- Revenue dashboard & analytics

## 📡 API Routes (REST API)
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | /api/auth/register                | Register new user        |
| POST   | /api/auth/login                   | Login & get JWT token    |
| GET    | /api/locations                    | Get all locations        |
| GET    | /api/slots/:locationId            | Get slots by location    |
| POST   | /api/bookings                     | Create new booking       |
| GET    | /api/bookings/my                  | Get my bookings          |
| PUT    | /api/bookings/:id/cancel          | Cancel a booking         |
| GET    | /api/admin/bookings               | All bookings (admin)     |
| PUT    | /api/admin/slots/:id/status       | Update slot status       |
| POST   | /api/admin/locations              | Add new location         |

## 🗄️ Database — MongoDB Collections
| Collection | Purpose                          |
|------------|----------------------------------|
| users      | Registered user accounts         |
| locations  | 12 Solapur parking zones         |
| slots      | Individual parking slots         |
| bookings   | All booking records              |
| sessions   | JWT session tracking             |

## 🚀 How to Run Locally

### Backend
\`\`\`bash
cd backend
npm install
# create .env file with:
# MONGO_URI=mongodb://localhost:27017/parkwise_db
# JWT_SECRET=your_secret_key
# PORT=5000
npm start
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

## 📁 Project Structure
\`\`\`
parkwise/
├── backend/
│   ├── server.js
│   ├── .env
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Booking.js
│   │   ├── Slot.js
│   │   └── Location.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── slotRoutes.js
│   │   └── adminRoutes.js
│   └── middleware/
│       └── authMiddleware.js
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── pages/
    │   ├── components/
    │   └── context/
    └── public/
\`\`\`

## 👨‍💻 Developed By Rehan Bagwan
Student Project — Solapur, Maharashtra (MH-13)
MERN Stack | Full Stack Web Development
