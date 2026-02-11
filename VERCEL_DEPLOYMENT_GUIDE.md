# PetHive Vercel Deployment Guide

## Issues Fixed

1. ✅ **Hardcoded localhost URLs** - Removed `http://localhost:3001` from `AdminLayout.jsx` and `ChatWidget.jsx`
2. ✅ **API client centralized** - All components now use the `api.js` helper which defaults to `/api`
3. ✅ **Vercel routing configured** - `vercel.json` properly routes `/api/*` to Express backend

## Deployment Steps

### Step 1: Set Environment Variables in Vercel Dashboard

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add these three variables for **Production**:

| Variable | Value | Example |
|----------|-------|---------|
| `DATABASE_URL` | Your database connection string | `postgresql://user:pass@localhost/pethive` or `file:./dev.db` |
| `SESSION_SECRET` | Random 32-char hex string | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `CLIENT_URL` | Your Vercel domain | `https://pethive-psi.vercel.app` |

**Important**: Only add these to the **Production** environment.

### Step 2: Commit and Push Code

```bash
git add .
git commit -m "Fix: Update API client for Vercel backend connectivity"
git push origin main
```

GitHub Actions will automatically trigger the deployment.

### Step 3: Verify Deployment Success

Check the GitHub Actions log for:
- ✅ Build completed successfully
- ✅ Deployment successful message

If it shows `Environment Variable "DATABASE_URL" references Secret "database-url", which does not exist`, then the environment variables weren't set correctly. Go back to Step 1.

### Step 4: Test the Live Application

1. **Check API health**: https://pethive-psi.vercel.app/health
   - Should return: `{"status":"ok","service":"PetHive API"}`

2. **Check products API**: https://pethive-psi.vercel.app/api/products
   - Should return a JSON array of products

3. **Visit the shop**: https://pethive-psi.vercel.app
   - Products should display in the Shop page
   - Click on products to view details

## If Products Aren't Loading

### Check browser console (F12):
- Look for error messages in the **Console** tab
- Check **Network** tab to see if `/api/products` request is succeeding

### If you see CORS errors:
- The backend CORS is configured for `https://pethive-psi.vercel.app`
- Make sure your Vercel domain matches

### If you see 404 errors on `/api/*`:
- Verify `vercel.json` routes are correct
- Check the build output in Vercel dashboard for errors

## Database Setup (First Deployment)

If this is your first deployment and you're using PostgreSQL:

```bash
# Push database schema
DATABASE_URL="your_connection_string" npx prisma db push

# Seed initial data (optional)
DATABASE_URL="your_connection_string" npm run seed
```

Or add to `server/package.json` postinstall:
```json
"postinstall": "npx prisma generate && npx prisma db push"
```

## Code Changes Summary

### AdminLayout.jsx
- Removed: `import axios from 'axios'` and hardcoded URLs
- Added: `import api from '../lib/api'`
- Updated: `axios.get('http://localhost:3001/api/...')` → `api.get('/auth/me')`

### ChatWidget.jsx  
- Removed: `import axios from 'axios'` and hardcoded URLs
- Added: `import api from '../lib/api'`
- Updated: All `axios.get/post/put/delete('http://localhost:3001/...')` → `api.get/post/put/delete('/messages')`

### api.js
- Added smart `getBaseURL()` function
- Defaults to `/api` on production (Vercel routes this to backend)
- Supports `VITE_API_URL` environment variable for custom backends

### vercel.json
- Properly routes `/api/*` to Express server
- Serves static React files for SPA routing
- No hardcoded secrets (they're managed in Vercel dashboard)

## Vercel Project Structure on Deployment

```
Production Deployment
├── Frontend (React)
│   ├── Built with Vite → client/dist/
│   ├── Served as static files
│   └── SPA routing via fallback to index.html
│
└── Backend (Express)
    ├── server/src/app.js
    ├── Routes all /api/* requests
    └── Connects to database via DATABASE_URL
```

## Troubleshooting

### "Error: Environment Variable references Secret which does not exist"
- Solution: Add the environment variable in Vercel Dashboard → Settings → Environment Variables

### Products page shows "Loading..." forever
- Check browser console for errors
- Verify DATABASE_URL is set and database has products
- Run: `curl https://pethive-psi.vercel.app/api/products`

### 404 on static files
- Clear browser cache
- Ensure build completed successfully in Vercel dashboard
- Check that `client/dist/` has files: `ls client/dist/`

### CORS errors
- CORS is pre-configured for your domain in `server/src/app.js`
- If using a different domain, update `CLIENT_URL`

## Local Development (For Testing Before Deploy)

```bash
# Terminal 1: Backend
cd server
npm install
npx prisma generate
npm run dev

# Terminal 2: Frontend  
cd client
npm install
npm run dev
```

Visit `http://localhost:5173` - API calls will proxy to `http://localhost:3001/api`
