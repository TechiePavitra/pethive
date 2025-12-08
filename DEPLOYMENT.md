# 🚀 Deploying PetHive to Vercel

Complete step-by-step guide to deploy your PetHive e-commerce platform to Vercel.

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account (sign up at vercel.com)
- ✅ Your code pushed to GitHub

## Step 1: Set Up Production Database

### Option A: Vercel Postgres (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database"
3. Select "Postgres"
4. Choose your region and create database
5. Copy the `DATABASE_URL` from the ".env.local" tab

### Option B: Neon (Free PostgreSQL)

1. Go to [Neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string (DATABASE_URL)

### Option C: Supabase

1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string

## Step 2: Deploy to Vercel

### Via Vercel Dashboard (Easiest)

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

2. **Configure Build Settings**
   - Framework Preset: **Vite** (should auto-detect)
   - Root Directory: Leave as is (`.`)
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install && cd client && npm install && cd ../server && npm install`

3. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   DATABASE_URL = <your-postgres-connection-string>
   SESSION_SECRET = <random-secure-string-here>
   NODE_ENV = production
   CLIENT_URL = <leave-empty-for-now>
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your deployment URL (e.g., `https://your-app.vercel.app`)

5. **Update CLIENT_URL**
   - Go to Project Settings → Environment Variables
   - Update `CLIENT_URL` to your deployment URL
   - Redeploy

## Step 3: Set Up Database Schema

After deployment:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull

# Push database schema
cd server
npx prisma db push

# Seed database with products
npm run seed
```

## Step 4: Update Frontend API URL

1. In Vercel Dashboard, go to your project
2. Settings → Environment Variables
3. Add:
   ```
   VITE_API_URL = https://your-app.vercel.app/api
   ```
4. Redeploy the project

## Step 5: Test Your Deployment

1. Visit your live URL
2. Test these features:
   - ✅ Homepage loads with products
   - ✅ Shop page shows all products
   - ✅ Category filtering works
   - ✅ Login/Register works
   - ✅ Shopping cart works
   - ✅ Admin login (admin@example.com / admin123)

## Environment Variables Summary

**Required for Production:**

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Random secure string for sessions | `supersecret123!@#` |
| `NODE_ENV` | Environment mode | `production` |
| `CLIENT_URL` | Your frontend URL | `https://pethive.vercel.app` |
| `VITE_API_URL` | API endpoint for frontend | `https://pethive.vercel.app/api` |

## Troubleshooting

### Deployment Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `package.json` scripts are correct

### Products Not Loading
- Check API endpoint in browser console
- Verify `VITE_API_URL` is set correctly
- Check database connection
- Run database seed: `npm run seed`

### 500 Internal Server Error
- Check Vercel function logs
- Verify `DATABASE_URL` is correct
- Ensure database schema is pushed: `npx prisma db push`

### Login Not Working
- Verify `SESSION_SECRET` is set
- Check CORS settings in backend
- Clear browser cookies and try again

## Post-Deployment

### Update Vercel Domain
After deployment, update these files with your actual domain:

1. **client/index.html** - Update Open Graph URLs
2. **client/public/sitemap.xml** - Update all URLs
3. **client/public/robots.txt** - Update sitemap URL

### Enable Custom Domain (Optional)
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Monitor Your App
- Vercel Dashboard → Your Project → Analytics
- Check function logs for errors
- Monitor database usage

## Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update website"
git push origin main
```

Vercel will automatically build and deploy! 🎉

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- Check project's GitHub Issues

---

**Happy Deploying! 🚀**
