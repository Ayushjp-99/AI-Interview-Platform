# 🚀 AI-Powered Mock Interview Platform - Setup & Testing Guide

## ✅ Current Project Status

**Frontend Build:** ✓ SUCCESSFUL (No errors)
**Backend Syntax:** ✓ VALID (Passes check)
**Architecture:** ✓ COMPLETE (All 12 phases implemented)
**Files Fixed:** ✓ api.js & AuthContext.jsx Bearer token syntax

---

## 📋 Prerequisites

Before running the application, ensure you have:

1. **Node.js v18+** - [Download](https://nodejs.org/)
2. **MongoDB** - [Download Community Edition](https://www.mongodb.com/try/download/community)
3. **Google Gemini API Key** - [Get API Key](https://ai.google.dev/)

---

## 🔧 Installation Steps

### Step 1: Ensure MongoDB is Running

**Windows (if installed via installer):**
```bash
# MongoDB should start automatically as a service
# Verify it's running on port 27017
mongosh  # or mongo (depending on version)
```

**Or start MongoDB manually:**
```bash
# If you have mongod.exe in your PATH
mongod --dbpath=C:\path\to\data
```

### Step 2: Configure Environment Variables

Navigate to the backend directory and update `.env`:

```bash
cd backend
nano .env  # or edit in your editor
```

**Update these values:**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-interview-platform
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY_HERE
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

⚠️ **Important:** Replace `YOUR_ACTUAL_GEMINI_API_KEY_HERE` with your real API key from Google AI Studio.

---

## 🏃 Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
📡 Environment: development
🌐 Frontend URL: http://localhost:5173
📊 API Health: http://localhost:5000/api/health
```

### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v6.4.3  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Access the Application

Open your browser and navigate to: **http://localhost:5173**

---

## ✅ Testing Checklist

Use this checklist to verify all features work correctly:

### 1. Authentication
- [ ] **Register**: Create a new account on the registration page
- [ ] **Login**: Sign in with your credentials
- [ ] **Persistent Login**: Refresh page - should stay logged in
- [ ] **Logout**: Click logout - should redirect to home
- [ ] **Protected Routes**: Try accessing `/dashboard` without login - should redirect to `/login`

### 2. Landing Page
- [ ] **Navigation**: All navbar links work
- [ ] **Dark/Light Mode**: Toggle between themes
- [ ] **CTA Buttons**: "Get Started" button navigates to registration
- [ ] **Sections Load**: Features, testimonials, FAQ, stats all visible
- [ ] **Smooth Scrolling**: Navigation links scroll smoothly

### 3. Dashboard
- [ ] **Stats Load**: Total interviews, average score, skill level display
- [ ] **Recent Interviews**: List of recent interviews shows
- [ ] **Charts Render**: Performance trend and category stats charts display
- [ ] **Activity Timeline**: Recent activities show correctly

### 4. Interview Module
- [ ] **Interview Setup**: Select category, difficulty, time limit, question count
- [ ] **Start Interview**: Click "Start" - questions load (check console for Gemini response)
- [ ] **Question Navigation**: Navigate between questions using buttons
- [ ] **Timer**: Timer counts down and shows remaining time
- [ ] **Progress Bar**: Shows progress through interview
- [ ] **Answer Submission**: Submit answer for a question - should evaluate (check console)
- [ ] **Review Answers**: Review submitted answers before completion
- [ ] **Complete Interview**: Finish interview - should generate report

### 5. Reports & Analytics
- [ ] **Report Page**: Displays interview scores, analysis, strengths/weaknesses
- [ ] **Charts**: Score breakdown and performance charts display
- [ ] **Learning Path**: Recommended topics show with priority levels
- [ ] **PDF Download**: Can download report as PDF (if implemented)

### 6. Interview History
- [ ] **List Interviews**: All completed interviews show in history
- [ ] **Filter**: Filter by category/difficulty/status
- [ ] **Search**: Search by category name
- [ ] **Delete**: Delete interview - should remove from list
- [ ] **Pagination**: Navigate between pages of interviews

### 7. Profile Page
- [ ] **User Info**: Name, email, avatar display
- [ ] **Statistics**: Total interviews, average score, skill level show
- [ ] **Achievements**: Badges/achievements display
- [ ] **Edit Profile**: Can update name, avatar, bio (if implemented)

### 8. Leaderboard
- [ ] **Global Rankings**: Users sorted by score/interview count
- [ ] **Weekly Rankings**: Current week standings display
- [ ] **Monthly Rankings**: Current month standings display
- [ ] **Top Users**: Top performers highlighted

### 9. Admin Panel (if logged in as admin)
- [ ] **User Management**: List of all users displays
- [ ] **Delete User**: Can delete users
- [ ] **Analytics**: API usage and database statistics display
- [ ] **Reports**: View analytics dashboard

### 10. Error Handling
- [ ] **Network Error**: Simulate network disconnect - should show error toast
- [ ] **Invalid Email**: Try registering with invalid email - shows error
- [ ] **Empty Fields**: Submit form with empty fields - shows validation errors
- [ ] **Duplicate Email**: Register with existing email - shows error
- [ ] **Timeout**: Long operations show loading states

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB connection failed: connect ECONNREFUSED
```

**Solution:** Make sure MongoDB is running on `localhost:27017`

```bash
# Windows - Start MongoDB Service
net start MongoDB

# Or manually start mongod
mongod
```

### Gemini API Error
```
❌ GEMINI_API_KEY is not configured
```

**Solution:** Add your Gemini API key to `.env`

1. Get API key from [Google AI Studio](https://ai.google.dev/)
2. Update `.env` file in backend directory
3. Restart backend server

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Check `FRONTEND_URL` in backend `.env` matches your frontend URL
- Should be: `http://localhost:5173`

### Port Already in Use
```
Port 5000 already in use
```

**Solution:** Either:
- Kill process using port 5000
- Change port in `.env`: `PORT=5001`

---

## 📊 API Health Check

To verify the backend is running properly, visit:

```
http://localhost:5000/api/health
```

You should see:
```json
{
  "success": true,
  "message": "AI Interview Platform API is running",
  "environment": "development",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔍 Monitoring & Debugging

### Check MongoDB Connection
```bash
mongosh  # Connect to MongoDB shell
show dbs  # Show databases
use ai-interview-platform  # Use your database
show collections  # Show collections
```

### Check Backend Logs
The backend logs all requests and errors to the console. Look for:
- ✅ MongoDB connection messages
- 📡 API request logs (if morgan logging enabled)
- ⚠️ Error messages

### Check Frontend Errors
Open browser Developer Tools (F12) and check:
- **Console tab**: JavaScript errors
- **Network tab**: API request failures
- **Application tab**: LocalStorage (check for token)

---

## 🚀 Next Steps for Production

1. **Environment Variables**: Use secure .env management (never commit .env)
2. **Database**: Use MongoDB Atlas (cloud) instead of local
3. **API Keys**: Rotate and secure Gemini API keys
4. **Frontend Build**: Run `npm run build` for production optimized build
5. **Backend Deployment**: Deploy to Railway, Render, or Heroku
6. **Frontend Deployment**: Deploy to Vercel, Netlify, or GitHub Pages
7. **SSL/TLS**: Enable HTTPS for production
8. **Rate Limiting**: Already implemented - review limits in production
9. **Logging**: Set up centralized logging (LogRocket, Sentry)
10. **Monitoring**: Add performance monitoring

---

## 📚 Project Structure Quick Reference

```
backend/
├── config/         - Database connection
├── controllers/    - Request handlers
├── middleware/     - Auth, validation, error handling
├── models/         - MongoDB schemas
├── routes/         - API endpoints
├── services/       - Gemini AI integration
├── utils/          - Helper functions
├── server.js       - Express app setup
└── .env            - Environment variables

frontend/
├── src/
│   ├── components/ - Reusable React components
│   ├── context/    - Auth & Theme contexts
│   ├── pages/      - Full page components
│   ├── services/   - API client (axios)
│   ├── utils/      - Helper functions
│   ├── App.jsx     - Main routing
│   └── main.jsx    - Entry point
└── vite.config.js  - Vite configuration
```

---

## 📖 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Interviews
- `POST /api/interviews/start` - Start new interview
- `POST /api/interviews/:id/answer` - Submit answer
- `POST /api/interviews/:id/complete` - Complete interview
- `GET /api/interviews/history` - Get interview history
- `GET /api/interviews/:id` - Get specific interview
- `DELETE /api/interviews/:id` - Delete interview
- `GET /api/interviews/dashboard-stats` - Get dashboard stats

### Reports
- `GET /api/reports/` - Get user's reports
- `GET /api/reports/:id` - Get specific report
- `GET /api/reports/interview/:interviewId` - Get report for interview

### Leaderboard
- `GET /api/leaderboard/` - Get global leaderboard
- `GET /api/leaderboard/weekly` - Get weekly rankings
- `GET /api/leaderboard/monthly` - Get monthly rankings

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `GET /api/admin/analytics` - Get analytics (admin only)

---

## 💡 Tips & Best Practices

1. **Development**: Keep browser DevTools open to monitor API calls and errors
2. **Testing**: Use Postman or Insomnia to test API endpoints directly
3. **Database**: Regularly backup your MongoDB data
4. **Frontend**: Clear localStorage if experiencing auth issues (`localStorage.clear()`)
5. **Performance**: Check Network tab in DevTools to see response times
6. **Debugging**: Use `console.log()` or set breakpoints in DevTools

---

## 📞 Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review **console logs** and **error messages**
3. Ensure all prerequisites are installed
4. Verify environment variables are set correctly
5. Check that ports 5000 (backend) and 5173 (frontend) are available

---

**Status:** ✅ Ready for Testing with MongoDB & Gemini API Key
**Last Updated:** 2024
**Version:** 1.0.0

