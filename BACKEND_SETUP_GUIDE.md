# Backend Server Setup Guide for Vercel

## Problem
Backend is not running on Vercel - products fail to load with "Backend server is not running" error.

## Root Cause
The Vercel deployment is missing required environment variables that the backend needs to connect to the database.

## Solution: Set Environment Variables on Vercel Dashboard

### Step 1: Go to Vercel Environment Variables
1. Visit: https://vercel.com/dashboard/projects/pethive
2. Click on the **pethive** project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Required Environment Variables

Add the following environment variables (same as GitHub Actions setup):

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `DATABASE_URL` | `file:./dev.db` | SQLite database (for testing) |
| `SESSION_SECRET` | Random 32-char hex string | Session encryption key |
| `CLIENT_URL` | `https://pethive-psi.vercel.app` | Frontend URL for CORS |
| `NODE_ENV` | `production` | Environment mode |

**How to generate SESSION_SECRET:**
- Use an online generator: https://www.random.org/hex/
- Or run in terminal: `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`
- Copy a random 32-character hex string

### Step 3: Set Environment for "Production"
Make sure each variable is set for:
- ✅ **Production** (checked)
- ✅ **Preview** (optional, for staging)
- ✅ **Development** (optional, for local testing)

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Select **Redeploy**
4. Wait for deployment to complete

### Step 5: Verify Backend is Running
1. Visit: https://pethive-psi.vercel.app/health
   - Should show: `{"status":"ok","service":"PetHive API"}`

2. Visit: https://pethive-psi.vercel.app/api/categories
   - Should show JSON array of product categories

3. Visit: https://pethive-psi.vercel.app (main site)
   - Shop page should load products

## Database Seeding

The workflow automatically seeds the database with sample products when you:
1. Add `DATABASE_URL` as a GitHub Actions secret (same as Vercel)
2. Push code to trigger a deployment

**To add GitHub Actions secret:**
1. Go: https://github.com/TechiePavitra/pethive/settings/secrets/actions
2. Click **New repository secret**
3. Name: `DATABASE_URL`
4. Value: `file:./dev.db` (or your PostgreSQL URL)
5. Click **Add secret**

## Troubleshooting

### Still getting "Backend server is not running"?
- [ ] Check Vercel dashboard shows all 4 environment variables
- [ ] Check `/health` endpoint returns status ok
- [ ] Check browser console for exact error message
- [ ] Check Vercel function logs for errors

### Database not seeding?
- [ ] Verify `DATABASE_URL` secret exists in GitHub Actions
- [ ] Check workflow logs: https://github.com/TechiePavitra/pethive/actions
- [ ] Re-run workflow or push a test commit

### Still empty database?
- [ ] Manually trigger seed: `cd server && npm run seed`
- [ ] Check `server/prisma/schema.prisma` is correct
- [ ] Check `server/prisma/seed.js` has product data

## Architecture

```
Frontend (Vercel Static)
    ↓ /api/* requests
Vercel Serverless Function (Express Backend)
    ↓ 
SQLite Database (file:./dev.db)
    ↓
Seed Data (server/prisma/seed.js)
```

## Files Modified
- `.github/workflows/deploy.yml` - Added seed step
- `vercel.json` - Routes API requests to backend
- `server/src/app.js` - Express backend configuration
- `server/prisma/seed.js` - Sample product data

## Next Steps
1. ✅ Add environment variables to Vercel
2. ✅ Redeploy application
3. ✅ Verify `/health` endpoint
4. ✅ Check products load on frontend
