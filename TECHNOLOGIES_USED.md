# Technologies Used 🚀

This document outlines the complete technology stack used to build **SwachhSetu**. The architecture was chosen to prioritize rapid development, high performance, and scalability for a hackathon environment.

---

## 🎨 Frontend Stack

| Technology | Purpose |
| :--- | :--- |
| **[React.js](https://reactjs.org/)** | The core library used for building the interactive, component-based user interface. |
| **[Vite](https://vitejs.dev/)** | Used as the frontend build tool and development server, providing lightning-fast Hot Module Replacement (HMR). |
| **[Tailwind CSS](https://tailwindcss.com/)** | A utility-first CSS framework used for rapid, custom UI styling without leaving the HTML/JSX. Enables responsive design effortlessly. |
| **[React Router](https://reactrouter.com/)** | Handles client-side routing, enabling seamless navigation between the Dashboard, AI Scanner, and Login pages without page reloads. |
| **React Context API** | Native React feature used for global state management (managing User Authentication and UI Toast Notifications). |
| **[Lucide React](https://lucide.dev/)** | Provides clean, consistent, and customizable SVG icons used throughout the application (navigation, badges, buttons). |
| **[Recharts](https://recharts.org/)** | A composable charting library built on React components, used in the Admin Dashboard to visualize waste collection trends and AI accuracy. |

---

## ⚙️ Backend Stack

| Technology | Purpose |
| :--- | :--- |
| **[Node.js](https://nodejs.org/)** | The JavaScript runtime environment executing the backend server infrastructure. |
| **[Express.js](https://expressjs.com/)** | A minimal and flexible Node.js web application framework used to build the RESTful API routing. |
| **[JSON Web Tokens (JWT)](https://jwt.io/)** | Implemented for secure, stateless user authentication and role-based access control (differentiating standard users from Admins). |
| **[Multer](https://github.com/expressjs/multer)** | Node.js middleware used for handling `multipart/form-data`, specifically for processing images uploaded to the AI Waste Scanner. |
| **[Cors](https://expressjs.com/en/resources/middleware/cors.html)** | Middleware that enables Cross-Origin Resource Sharing, allowing the frontend React app to securely communicate with the backend API. |

---

## 🤖 Artificial Intelligence

| Technology | Purpose |
| :--- | :--- |
| **[Google Generative AI SDK](https://ai.google.dev/)** | The `@google/generative-ai` library connects the Node backend to Google's AI services. |
| **Gemini Vision Model (`gemini-flash-latest`)** | Google's highly efficient multimodal large language model. It acts as the core of the "AI Waste Scanner", analyzing user-uploaded images, identifying objects, and mapping them to standardized waste categories in strict JSON format. |

---

## 🗄️ Database

| Technology | Purpose |
| :--- | :--- |
| **[MongoDB](https://www.mongodb.com/)** | A NoSQL database used to store users, waste pickup requests, and AI scan history due to its flexible, document-oriented schema. |
| **[Mongoose](https://mongoosejs.com/)** | An Object Data Modeling (ODM) library for MongoDB and Node.js. Used to enforce data schemas, relationships, and validations for `WasteRequest` and `ScanHistory` models. |

---

## 🛠️ Development & Tooling

| Technology | Purpose |
| :--- | :--- |
| **[Nodemon](https://nodemon.io/)** | Utility that monitors for changes in backend source code and automatically restarts the Node server, speeding up API development. |
| **Environment Variables (`dotenv`)** | Used to securely manage sensitive configurations like the `MONGODB_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`. |
