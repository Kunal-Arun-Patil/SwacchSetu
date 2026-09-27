# SwachhSetu 🌱

**SwachhSetu** is a Smart Waste Collection & Recycling Platform designed to make responsible waste disposal effortless. It allows residents to easily schedule waste pickups and gives city administrators powerful tools to track, manage, and analyze waste collection across the city.

---

## ✨ Key Features

- **AI Waste Scanner**: Powered by Google Gemini Vision. Users can upload or capture an image of their waste, and the AI automatically identifies the material category (Plastic, E-waste, Organic, etc.) and suggests proper disposal methods.
- **Smart Pickup Scheduling**: Users can schedule waste pickups in seconds, selecting preferred dates, times, and specifying waste quantities.
- **Real-Time Tracking**: Users can track their requests from `Pending` all the way to `Collected`.
- **Admin Dashboard**: City administrators have access to a central hub to monitor daily operations, filter requests by status, update pickup states, and view AI accuracy analytics.
- **Role-Based Authentication**: Secure access separation for regular users and administrators.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- React Router (Navigation)
- Tailwind CSS (Styling)
- Lucide React (Icons)
- Recharts (Analytics visualization)

**Backend:**
- Node.js & Express (REST API)
- MongoDB & Mongoose (Database)
- Google Generative AI (`gemini-flash-latest` for Vision)
- JSON Web Tokens (JWT Authentication)
- Multer (Image uploads)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) installed and running on your local machine.

### 1. Clone the repository
```bash
# Clone the repository and navigate into it
cd swachhsetu
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create a .env file (you can copy from .env.example)
# Ensure the following variables are set:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/swachhsetu
# JWT_SECRET=your_jwt_secret
# GEMINI_API_KEY=your_google_gemini_api_key

# Seed the database with demo data
npm run seed

# Start the backend development server
npm run dev
```
The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```
The frontend will run on `http://localhost:3000`.

---

## 🔐 Demo Accounts

For demonstration and hackathon judging purposes, use the following built-in accounts to test the platform:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@swachhsetu.com` | `admin123` |
| **User** | `user@swachhsetu.com` | `user123` |

---

## 📂 Project Structure

```
swachhsetu/
├── backend/
│   ├── models/        # Mongoose schemas (WasteRequest, ScanHistory)
│   ├── routes/        # Express API endpoints (auth, requests, scan, stats)
│   ├── services/      # Business logic (aiService with Gemini integration)
│   ├── middleware/    # JWT authentication middleware
│   ├── uploads/       # Temporary storage for AI scanner images
│   └── server.js      # Main Express entry point
│
└── frontend/
    ├── src/
    │   ├── components/# Reusable UI (Navbar, Cards)
    │   ├── context/   # React Context (Auth, Toasts)
    │   ├── pages/     # Main views (Home, Login, AdminDashboard, AiScanner, etc.)
    │   └── App.jsx    # Application routing
    └── tailwind.config.js
```

---

*Built with ❤️ for a cleaner, greener future.*
