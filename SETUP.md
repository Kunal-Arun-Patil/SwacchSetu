# Setup & Run Instructions 🚀

Follow these step-by-step instructions to get **SwachhSetu** running on your local machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:
1. **[Node.js](https://nodejs.org/en/download/)** (v18.0.0 or higher recommended)
2. **[MongoDB](https://www.mongodb.com/try/download/community)** (Make sure the local MongoDB server is running, or have a MongoDB Atlas cloud URI ready)
3. **Git** (for cloning the repository)

---

## 🛠️ Step 1: Clone the Repository

Open your terminal and clone the project to your local machine:

```bash
git clone <repository-url>
cd swachhsetu
```
*(If you have already downloaded the project folder, just open your terminal and navigate inside the `swachhsetu` root directory).*

---

## ⚙️ Step 2: Backend Setup & Configuration

The backend handles the API, database connection, and the Gemini AI integration.

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a new file named `.env` inside the `backend` folder and add the following configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/swachhsetu
   JWT_SECRET=swachhsetu_secret_2024
   
   # You must provide your own Google Gemini API key to use the AI Scanner
   GEMINI_API_KEY=your_actual_google_gemini_api_key_here
   ```
   *(To get a Gemini API key, visit [Google AI Studio](https://aistudio.google.com/app/apikey) and generate a free key).*

4. **Seed the Database (Optional but Recommended):**
   This script populates the database with demo waste requests so you don't start with a blank dashboard.
   ```bash
   npm run seed
   ```

5. **Start the Backend Server:**
   ```bash
   npm run dev
   ```
   *You should see a message in the terminal saying: `MongoDB connected` and `Server running on port 5000`.*

---

## 💻 Step 3: Frontend Setup

The frontend is the React application that the user interacts with.

1. **Open a NEW terminal window/tab** (leave the backend running in the first one).
2. **Navigate to the frontend folder** from the project root:
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```
   *Vite will start the server and give you a local network link.*

---

## 🎉 Step 4: Access the Application

Open your web browser and go to:
👉 **[http://localhost:3000](http://localhost:3000)**

### Demo Login Credentials

You can test the application using the following pre-configured accounts:

**User Account (Scheduling & Scanning):**
- **Email:** `user@swachhsetu.com`
- **Password:** `user123`

**Admin Account (Dashboard Analytics & Approvals):**
- **Email:** `admin@swachhsetu.com`
- **Password:** `admin123`

---

## ⚠️ Troubleshooting

- **MongoDB connection failed:** Make sure your local MongoDB service is actively running. If you are using Windows, check the "Services" app and ensure "MongoDB Server" is running.
- **AI Scanner says "Analysis Failed":** Double check that your `GEMINI_API_KEY` is correct inside `backend/.env`. The key must have access to the `gemini-flash-latest` model.
- **Port 5000 is already in use:** If another app is using port 5000, change the `PORT` in `backend/.env` to `5001`. You will also need to update the proxy setting in `frontend/vite.config.js` to point to the new port.
