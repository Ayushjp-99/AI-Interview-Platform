# 🎯 AI-Powered Mock Interview Platform

<div align="center">

![Platform Banner](https://img.shields.io/badge/AI-Mock%20Interview%20Platform-6C63FF?style=for-the-badge&logo=robot&logoColor=white)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-43E97B?style=for-the-badge)
![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-FF6584?style=for-the-badge&logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A production-ready AI-powered interview preparation platform built with the MERN Stack and Google Gemini AI.**

[Live Demo](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📌 Project Overview

The **AI-Powered Mock Interview Platform** is a full-stack SaaS application that helps developers prepare for technical interviews using real-time AI evaluation. Users can practice interviews across 17+ technology categories, receive detailed feedback powered by Google Gemini, track their progress with analytics, and compete on a global leaderboard.

---

## ✨ Features

### 🔐 Authentication
- Secure JWT-based login and registration
- Role-based access control (User / Admin)
- Password hashing with bcrypt
- Persistent login sessions

### 🎯 Interview Module
- 17+ interview categories (MERN, React, Node, JavaScript, Python, Java, C++, and more)
- Difficulty levels: Easy, Medium, Hard
- Custom question count and time limits
- AI-generated questions — never hardcoded

### 🤖 Google Gemini AI Integration
- Dynamic question generation per category and difficulty
- Detailed answer evaluation with:
  - Score (0–100)
  - Explanation
  - Mistakes identified
  - Better answer suggestion
  - Improvement suggestions
  - Confidence rating
  - Difficulty analysis

### 📊 Analytics & Reports
- Overall score and topic-wise breakdown
- Strengths and weaknesses analysis
- Personalized learning path
- PDF report download
- Interactive charts (Chart.js)

### 🏆 Leaderboard
- Weekly and monthly rankings
- Top performers by score and interview count

### 👤 User Profile
- Profile management
- Performance statistics
- Achievements and badges
- Skill level tracking

### 🛡️ Admin Panel
- User management (view/delete)
- Analytics dashboard
- API usage statistics
- Database statistics

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Local) + Mongoose |
| **Authentication** | JWT + bcrypt |
| **AI Integration** | Google Gemini API |
| **Charts** | Chart.js + react-chartjs-2 |
| **Icons** | React Icons |
| **HTTP Client** | Axios |
| **PDF Generation** | jsPDF + html2canvas |

---

## 📁 Folder Structure

```
AI-Powered-Mock-Interview-Platform/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── interviewController.js
│   │   ├── reportController.js
│   │   ├── leaderboardController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Interview.js
│   │   ├── Report.js
│   │   └── Leaderboard.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── interviewRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── leaderboardRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   └── geminiService.js
│   ├── utils/
│   │   └── helpers.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── interview/
│   │   │   └── admin/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (running locally)
- Google Gemini API key

### 1. Clone the repository
```bash
git clone <repository-url>
cd AI-Powered-Mock-Interview-Platform
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-interview-platform
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Run Commands

| Command | Description |
|---------|-------------|
| `npm run dev` (backend) | Start backend development server |
| `npm run dev` (frontend) | Start frontend development server |
| `npm start` (backend) | Start backend in production mode |
| `npm run build` (frontend) | Build frontend for production |

---

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| POST | `/api/interviews/start` | Start new interview | ✅ |
| POST | `/api/interviews/submit` | Submit answers | ✅ |
| GET | `/api/interviews/history` | Get interview history | ✅ |
| GET | `/api/reports/:id` | Get specific report | ✅ |
| GET | `/api/leaderboard` | Get leaderboard | ✅ |
| GET | `/api/admin/users` | Get all users | ✅ Admin |
| DELETE | `/api/admin/users/:id` | Delete user | ✅ Admin |

---

## 🗺️ Future Scope

- [ ] Voice-based interview mode
- [ ] Video interview with facial analysis
- [ ] Company-specific interview tracks
- [ ] Peer mock interviews
- [ ] Resume builder integration
- [ ] LinkedIn integration
- [ ] Mobile app (React Native)
- [ ] Stripe payments for premium plans

---

## 📸 Screenshots

> Screenshots will be added after deployment.

---

## 🚀 Deployment Guide

### Backend (Railway / Render)
1. Set environment variables in your cloud provider dashboard
2. Connect your GitHub repository
3. Deploy the `backend/` directory

### Frontend (Vercel / Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=<your-backend-url>`

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

Built with ❤️ using MERN Stack + Google Gemini AI

</div>
