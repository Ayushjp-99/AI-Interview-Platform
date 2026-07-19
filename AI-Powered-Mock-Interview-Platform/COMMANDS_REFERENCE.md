# 📋 COMMAND REFERENCE - Groq API Migration

## Setup Commands

### Get API Key
```bash
# Visit this URL in your browser:
https://console.groq.com

# Steps:
1. Sign up (free)
2. Go to API Keys
3. Create new key
4. Copy the key
```

### Update Environment
```bash
# Edit backend/.env
GROQ_API_KEY=your_key_from_console
```

### Install Dependencies (Already Done)
```bash
cd backend
npm install
```

## Running Commands

### Terminal 1 - Backend
```bash
cd backend
npm start

# Output should show:
# ✓ Server running on http://localhost:5000
# ✓ Connected to MongoDB
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start

# Output should show:
# ✓ Local: http://localhost:5173/
```

### Development Mode (Auto-reload)
```bash
# Backend with hot reload
cd backend
npm run dev

# Frontend with hot reload
cd frontend
npm run dev
```

## Verification Commands

### Check Backend Syntax
```bash
cd backend
node -c server.js
node -c services/groqService.js
node -c controllers/interviewController.js
```

### Check Frontend Build
```bash
cd frontend
npm run build
```

### List Installed Packages
```bash
cd backend
npm list
```

### Check Node Version
```bash
node -v
# Should be v14+ (for best compatibility)
```

### Check npm Version
```bash
npm -v
# Should be v6+
```

## Git Commands (Optional)

### Stage Changes
```bash
git add .
```

### Commit Changes
```bash
git commit -m "Migrate from Gemini to Groq API"
```

### View Status
```bash
git status
```

### View Diff
```bash
git diff backend/services/
```

## Cleanup Commands (Optional)

### Remove Old Gemini Files
```bash
# Remove old service
cd backend
rm services/geminiService.js

# Remove test script
rm test-gemini-models.js
```

### Remove Node Modules (if needed)
```bash
cd backend
rm -rf node_modules
npm install
```

### Clear npm Cache
```bash
npm cache clean --force
```

## Testing Commands

### Run Interview Setup Test
```bash
# Manual: Browser → Register → Start Interview → Select options → Start
# Expected: Questions appear within 5 seconds
```

### Check API Response
```bash
# Option 1: Use curl
curl -X GET http://localhost:5000/api/health

# Option 2: Check browser console
# Open http://localhost:5173
# Press F12 → Network tab
# Click "Start Interview"
# Watch API calls
```

### Monitor Backend Logs
```bash
# Terminal already shows logs
# Look for:
# - "Server running on..."
# - "Connected to MongoDB"
# - No error messages

# Errors appear as:
# "Error:" in console
# Check backend/.env if API key issues
```

## Environment Management

### View Current Environment
```bash
cat backend/.env
```

### Create .env from Example
```bash
cp backend/.env.example backend/.env
# Then edit backend/.env with your Groq key
```

### Reset to Example
```bash
cp backend/.env.example backend/.env
# (you'll lose custom values, be careful!)
```

## Troubleshooting Commands

### Kill Process on Port
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Check Port Usage
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Mac/Linux
lsof -i :5000
lsof -i :5173
```

### View Full Stack Trace
```bash
# In terminal where backend is running:
# Look for full error message and stack trace
# Copy it for debugging
```

## Production Commands

### Build Frontend for Production
```bash
cd frontend
npm run build
# Creates dist/ folder (upload this)
```

### Set Production Environment
```bash
# Edit backend/.env
NODE_ENV=production

# Don't forget to:
# - Use production Groq API key
# - Set strong JWT_SECRET
# - Use production MongoDB URL
```

### Start Production Backend
```bash
cd backend
npm start
# No hot reload, optimized for speed
```

## Database Commands

### Check MongoDB Connection
```bash
# Backend logs should show:
# "Connected to MongoDB: mongodb://localhost:27017/ai-interview-platform"

# Or check manually:
# Make sure MongoDB is running
# Windows: mongod.exe is running
# Mac/Linux: mongod service is running
```

### Access MongoDB Data (Optional)
```bash
# Install MongoDB Compass (GUI)
# Or use mongosh (CLI)

mongosh mongodb://localhost:27017/ai-interview-platform
# Commands:
# show collections
# db.users.find()
# db.interviews.find()
```

## Useful npm Commands

### Global install (optional)
```bash
npm install -g nodemon   # Auto-reload on changes
```

### Update Dependencies
```bash
cd backend
npm update

cd ../frontend
npm update
```

### Check for Security Issues
```bash
npm audit

# Fix if needed:
npm audit fix
```

### View Dependency Tree
```bash
npm list
npm list --depth=0  # Only top level
```

## VS Code Commands

### Format Code (if ESLint installed)
```bash
# In VS Code terminal:
npm run lint
npm run lint -- --fix  # Auto-fix issues
```

### Debug in VS Code
```bash
# Create .vscode/launch.json
# Add Node debugger configuration
# Press F5 to start debugging
```

## Docker Commands (Advanced)

### Build Docker Image (optional)
```bash
docker build -t ai-interview-platform-backend .
docker build -t ai-interview-platform-frontend .
```

### Run in Docker (optional)
```bash
docker run -p 5000:5000 ai-interview-platform-backend
docker run -p 5173:5173 ai-interview-platform-frontend
```

## Useful Links

### Groq Console
```
https://console.groq.com
```

### Groq API Docs
```
https://console.groq.com/docs
```

### Local Frontend
```
http://localhost:5173
```

### Local Backend
```
http://localhost:5000
```

### API Endpoint Examples
```
POST   http://localhost:5000/api/auth/register
POST   http://localhost:5000/api/auth/login
POST   http://localhost:5000/api/interviews/start
GET    http://localhost:5000/api/interviews/history
```

## Quick Reference

| Task | Command |
|------|---------|
| Get API key | https://console.groq.com |
| Update .env | `nano backend/.env` or use text editor |
| Install deps | `npm install` |
| Start backend | `npm start` (in backend dir) |
| Start frontend | `npm start` (in frontend dir) |
| Check syntax | `node -c server.js` |
| Build frontend | `npm run build` |
| Clean install | `rm node_modules && npm install` |
| Kill process | `taskkill /PID <id> /F` (Windows) |
| Check logs | See terminal output |
| Reset env | `cp .env.example .env` |

---

**That's it! You're all set! 🚀**
