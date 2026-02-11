# IMMEDIATE ACTION: Enable Backend Server

The backend is deployed but not running because **environment variables are missing from Vercel**.

## ⚡ Quick Fix (5 minutes)

### 1. Open Vercel Dashboard
https://vercel.com/dashboard

### 2. Click "pethive" Project
Look for the pethive project in your dashboard.

### 3. Go to Settings → Environment Variables

### 4. Add These 4 Variables:

**Variable 1:**
- Name: `NODE_ENV`
- Value: `production`
- Environment: Production, Preview, Development

**Variable 2:**
- Name: `CLIENT_URL`
- Value: `https://pethive-psi.vercel.app`
- Environment: Production, Preview, Development

**Variable 3:**
- Name: `DATABASE_URL`
- Value: `file:./dev.db`
- Environment: Production, Preview, Development

**Variable 4:**
- Name: `SESSION_SECRET`
- Value: Generate a random hex string (32 characters):
  - Option A: Visit https://www.random.org/hex/ and copy any 32-char hex
  - Option B: Open terminal and run: `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`
  - Copy the output
- Environment: Production, Preview, Development

### 5. Click "Save" After Each Variable

### 6. Redeploy Application
- Go to **Deployments** tab
- Click **...** (three dots) on latest deployment
- Click **Redeploy**
- Wait ~2 minutes for deployment to finish

### 7. Test Backend
Visit these URLs to verify:
- https://pethive-psi.vercel.app/health → Should show `{"status":"ok","service":"PetHive API"}`
- https://pethive-psi.vercel.app → Shop page should load with products

## What Was Fixed
- ✅ Fixed all 13 ESLint errors
- ✅ Fixed deployment workflow
- ✅ Added database seeding
- ✅ Now just need environment variables on Vercel

## Timeline
- GitHub Actions will seed database automatically on next deployment
- First deployment may take 2-3 minutes
- Products should appear immediately after

## Verification Checklist
- [ ] All 4 environment variables added to Vercel
- [ ] Application redeployed
- [ ] `/health` endpoint returns OK
- [ ] Shop page loads without "Backend server is not running" error
- [ ] Products display in grid
