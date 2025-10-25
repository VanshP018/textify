# 💬 Textify — Real-Time Chat Application

**Textify** is a full-stack real-time chat application built using the **MERN Stack**, **Socket.io**, **bcryptjs**, and **Daisy UI**.  
It enables instant messaging with secure authentication, responsive design, and a smooth user experience — all crafted from the ground up.

---

## 🚀 Overview

Textify allows users to:
- 🔹 Register and log in securely (passwords encrypted with bcryptjs)
- 🔹 Chat instantly in real-time using Socket.io
- 🔹 Create or join one-on-one and group conversations
- 🔹 Enjoy a clean, modern, responsive interface built with Daisy UI

This project reflects my learning journey into **real-time web applications**, **authentication systems**, and **scalable MERN architectures**.

---

## 🧠 What I Learned

While building Textify, I explored and mastered:
- ⚡ **Socket.io:** Implementing real-time, bidirectional communication
- 🧩 **MERN Architecture:** Structuring full-stack applications for scalability
- 🔐 **Authentication:** Secure login & registration with JWT and bcryptjs
- 🎨 **Frontend Design:** Clean and responsive UIs using Daisy UI
- 🛠️ **Debugging & Deployment:** Handling production-level issues and optimization

> “You don’t learn development by watching — you learn it by building, breaking, and rebuilding.” 💡

---

## 🛠️ Tech Stack

**Frontend:**
- React.js  
- Daisy UI  
- Axios  
- Socket.io-client  

**Backend:**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- Socket.io  
- bcryptjs  
- JSON Web Tokens (JWT)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/textify.git
cd textify
2️⃣ Backend Setup
bash
Copy code
cd server
npm install
Create a .env file in the /server directory:

ini
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Start the backend:

bash
Copy code
npm start
3️⃣ Frontend Setup
bash
Copy code
cd ../client
npm install
npm run dev


🧩 Core Features
Feature	Description
💬 Real-Time Chat	Instant communication via Socket.io
🔐 Authentication	Secure login & signup using JWT + bcryptjs
👥 Group Chats	Create and manage group conversations
🧠 Scalable API	RESTful architecture with Express.js
🎨 Responsive Design	Modern and accessible UI using Daisy UI
⚙️ Error Handling	Backend validation and error middleware


