# 🚀 Quick Setup Script for PetHive

This guide will get you up and running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 16+ installed
- ✅ npm installed
- ✅ Git installed

## Quick Start (Copy & Paste)

### Windows (PowerShell)
```powershell
# 1. Install all dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# 2. Setup environment variables
cd server
copy .env.example .env
cd ..

cd client
copy .env.example .env
cd ..

# 3. Setup database
cd server
npx prisma generate
npx prisma db push
npm run seed
cd ..

# 4. Start development servers
# Open two terminals:

# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

### Mac/Linux (Bash)
```bash
# 1. Install all dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# 2. Setup environment variables
cd server
cp .env.example .env
cd ..

cd client
cp .env.example .env
cd ..

# 3. Setup database
cd server
npx prisma generate
npx prisma db push
npm run seed
cd ..

# 4. Start development servers
# Open two terminals:

# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

## What This Does

1. **Installs Dependencies** - Downloads all required Node.js packages
2. **Creates .env Files** - Sets up environment configuration
3. **Sets Up Database** - Creates SQLite database with sample data
4. **Starts Servers** - Runs backend (port 3001) and frontend (port 5173)

## Access the App

- 🌐 **Frontend**: http://localhost:5173
- 🔌 **Backend API**: http://localhost:3001
- 👨‍💼 **Admin Login**: admin@example.com / admin123

## Next Steps

1. Browse products
2. Test shopping cart
3. Try login/register
4. Check admin dashboard

## Troubleshooting

### "command not found: npm"
Install Node.js from https://nodejs.org/

### "Port 3001 already in use"
Kill the process or change PORT in server/.env

### "Products not loading"
Make sure backend server is running on port 3001

### Need to reset database?
```bash
cd server
rm prisma/dev.db
npx prisma db push
npm run seed
```

## Ready to Deploy?

See `DEPLOYMENT.md` for Vercel deployment instructions!

---

**Enjoy building with PetHive! 🐾**
