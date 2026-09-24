# ⚡ Quick Start Guide - 5 Minutes to Running

## Prerequisites
- Node.js v18+ installed
- MongoDB running locally (or starting it now)
- Google Gemini API key ([get it here](https://ai.google.dev/))

---

## 🚀 5-Minute Setup

### Step 1: Start MongoDB (1 minute)

**Windows:**
```bash
mongod
```

Or if MongoDB is installed as service:
```bash
# It should already be running
```

### Step 2: Configure Backend Environment (1 minute)

Open `backend/.env` and update:

```env
GEMINI_API_KEY=paste_your_actual_api_key_here
```

Keep other values as default.

### Step 3: Start Backend Server (1 minute)

Open Terminal 1:
```bash
cd backend
npm run dev
```

Wait for:
```
🚀 Server running on port 5000
```

### Step 4: Start Frontend Development Server (1 minute)

Open Terminal 2:
```bash
cd frontend
npm run dev
```

Wait for:
```
➜  Local:   http://localhost:5173/
```

### Step 5: Open in Browser (1 minute)

Go to: **http://localhost:5173**

---

## 🧪 First Test

### Try This:
1. **Sign Up**: Create account with any email
2. **Dashboard**: See welcome screen
3. **Start Interview**: Click "Start Interview"
4. **Choose Settings**: Pick category, difficulty, etc.
5. **See Questions**: Gemini generates questions in real-time
6. **Answer**: Type an answer
7. **Get Feedback**: AI evaluates your answer

---

## ❌ Troubleshooting

### ❌ MongoDB Error
```
connection refused
```
**Solution:** Start MongoDB
```bash
mongod  # Windows
# or start as service
```

### ❌ Gemini Error
```
GEMINI_API_KEY not configured
```
**Solution:** Add key to `backend/.env`
1. Get key from https://ai.google.dev/
2. Update `backend/.env`: `GEMINI_API_KEY=your_key`
3. Restart backend

### ❌ Port Already in Use
```
Port 5000 already in use
```
**Solution:** Kill process or change port in `backend/.env`

### ❌ CORS Error
```
CORS policy blocked
```
**Solution:** Already configured, restart backend if still broken

---

## 📚 Full Documentation

- **Complete Setup:** See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **What's Built:** See [COMPLETION_REPORT.md](./COMPLETION_REPORT.md)
- **Project Info:** See [README.md](./README.md)

---

## 🎯 What to Test

| Feature | How to Test |
|---------|------------|
| **Sign Up** | Fill form, submit |
| **Login** | Use credentials from signup |
| **Interviews** | Click "Start Interview" |
| **AI Features** | Submit answer, get feedback |
| **Dashboard** | View after completing interview |
| **Leaderboard** | Click Leaderboard in menu |
| **Admin** | (Need admin account) |

---

## 💡 Tips

- Keep browser DevTools open (F12) to see any errors
- MongoDB must be running before starting backend
- Gemini API key is required for interviews to work
- First interview may take 10-15 seconds (Gemini generating)

---

## ✅ Status

- ✅ Frontend: Builds successfully
- ✅ Backend: Ready to run
- ✅ Database: Schema prepared
- ✅ AI: Integrated and ready
- ⏳ Testing: Ready for your testing

---

**🎉 You're all set! Start the servers and explore!**
