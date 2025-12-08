# 🔧 Quick Fix Guide - Starting PetHive Servers

## The Issue
You're seeing "Failed to load products" because the backend server isn't running yet.

## Solution - Start Both Servers

You need to have **TWO terminal windows open** - one for backend, one for frontend.

### Step 1: Start Backend Server

**Open Terminal/PowerShell #1:**
```powershell
cd C:\Users\royal\Downloads\webdevelopment-learning-repo\project-universe\server
npm run dev
```

**You should see:**
```
🚀 PetHive API server running on port 3001
📝 Environment: development
```

**Keep this terminal OPEN and RUNNING!**

---

### Step 2: Start Frontend Server

**Open Terminal/PowerShell #2 (NEW WINDOW):**
```powershell
cd C:\Users\royal\Downloads\webdevelopment-learning-repo\project-universe\client
npm run dev
```

**You should see:**
```
VITE v4.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

### Step 3: Open in Browser

Visit: **http://localhost:5173**

Products should now load! ✅

---

## Admin Login Credentials

**Email:** `admin@example.com`  
**Password:** `admin123`

> **Note:** Make sure you're on the `/login` page, toggle to login mode (not register), and enter these exact credentials.

---

## Troubleshooting

### "npm run dev" not found
```powershell
npm install
```

### Port 3001 already in use
Find and kill the process:
```powershell
# Find process on port 3001
netstat -ano | findstr :3001

# Kill it (replace PID with the number from above)
taskkill /PID <PID> /F
```

### Still can't login as admin
The database was just reseeded. Try:
1. Clear browser cookies/cache
2. Try incognito/private window
3. Make sure you're using exact credentials above

---

## Quick Test

**Test backend is running:**
Visit http://localhost:3001 in browser - should show API info

**Test products endpoint:**
Visit http://localhost:3001/api/products - should show JSON with products

---

**Both terminals must stay open while using the app!**
