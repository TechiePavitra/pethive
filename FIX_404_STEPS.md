# Fix 404 Error on PetHive Vercel Deployment

## ✅ What I've Fixed

1. ✅ Updated `vercel.json` routing configuration
2. ✅ Created environment variable templates
3. ✅ Built the client successfully

## 🔴 What Still Needs To Be Done (Manual)

Your app is still returning 404 because **environment variables are not configured in Vercel**. Here's exactly what to do:

### Step 1: Check Your Database

You need a PostgreSQL database connection string. Choose ONE:

**Option A: Use Vercel Postgres (Easiest)**
1. Go to https://vercel.com/dashboard
2. Click "Storage" in the left sidebar
3. Click "Create Database" → "Postgres"
4. Follow the setup wizard
5. Copy the `DATABASE_URL` from the connection string tab

**Option B: Use Neon (Free)**
1. Go to https://neon.tech
2. Sign up for free account
3. Create new project
4. Copy your connection string

**Option C: Use Supabase**
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy the connection string

### Step 2: Generate SESSION_SECRET

Open PowerShell and run:
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Copy the output - this will be your SESSION_SECRET.

### Step 3: Add Environment Variables to Vercel

1. Go to https://vercel.com/dashboard
2. Click on your **pethive-psi** project
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)
5. Add these variables one by one:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `https://pethive-psi.vercel.app/api` | Production |
| `CLIENT_URL` | `https://pethive-psi.vercel.app` | Production |
| `DATABASE_URL` | `<your-postgres-url>` | Production |
| `SESSION_SECRET` | `<random-string-from-step-2>` | Production |
| `NODE_ENV` | `production` | Production |

**⚠️ IMPORTANT:** Make sure each variable is set to "Production" environment!

### Step 4: Redeploy Your App

1. Go to **Deployments** tab in your Vercel project
2. Find the latest deployment (usually at the top)
3. Click the **...** (three dots) menu
4. Click **Redeploy**
5. Wait for it to complete (should take 2-3 minutes)

### Step 5: Push Database Schema

After redeployment succeeds, run these commands locally:

```bash
cd server
npx prisma db push
```

This will create the database tables.

### Step 6: Verify It Works

Test these URLs in your browser:

1. **API endpoint:**
   ```
   https://pethive-psi.vercel.app/api
   ```
   Should show JSON response with API info

2. **Health check:**
   ```
   https://pethive-psi.vercel.app/health
   ```
   Should show: `{"status":"ok","service":"PetHive API"}`

3. **Main app:**
   ```
   https://pethive-psi.vercel.app
   ```
   Should show the PetHive homepage

## 🐛 Troubleshooting

### Still getting 404?
1. Check Vercel build logs:
   - Go to Deployments → Latest → Click it
   - Look for "Build" and "Function" logs
   - Look for any error messages

2. Verify environment variables:
   - Settings → Environment Variables
   - Make sure all variables show "Production" environment
   - Click each one to verify the value is correct

3. Check that the app actually redeployed:
   - Go to Deployments
   - Click the latest deployment
   - Scroll down and look for timestamps
   - Should be from today/recently

### Getting database errors?
- Verify `DATABASE_URL` is correct
- Ensure database server is running and accessible
- Check that Prisma schema matches your needs

### Getting connection errors on API calls?
- Check that `VITE_API_URL` is set correctly
- Open browser DevTools (F12) → Network tab
- Make a request and check where it's going
- Should be to `https://pethive-psi.vercel.app/api/...`

## 📝 Summary

| What | Status | Next Step |
|-----|--------|-----------|
| vercel.json fixed | ✅ Done | Nothing |
| Client build | ✅ Done | Nothing |
| Environment vars | ❌ Needed | Add to Vercel |
| Redeploy | ❌ Needed | Click redeploy in Vercel |
| Database schema | ❌ Needed | Run `npx prisma db push` |

Once you complete the steps above, everything should work! Let me know if you hit any issues.
