# 🔧 Fixing Vercel 404 Error

## Issue
You're getting a `404: NOT_FOUND` error on your Vercel deployment. This usually happens because:
1. Frontend routes aren't being served correctly
2. API environment variables aren't configured
3. Routing configuration in `vercel.json` is incorrect

## ✅ Fixes Applied

### 1. Updated `vercel.json` Routing
**Problem:** The previous configuration had incorrect route ordering.

**Solution:** Fixed the routes to properly handle:
- API requests → Server
- All other requests → React SPA (`/index.html`)

The updated routing uses a negative lookahead pattern to avoid serving `/index.html` for `/api/*` and `/health` endpoints.

## 🚀 Deployment Checklist

### Step 1: Set Environment Variables in Vercel
Go to your [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Add these variables:

```
VITE_API_URL = https://your-app-name.vercel.app/api
DATABASE_URL = <your-postgres-connection-string>
SESSION_SECRET = <random-secure-string>
NODE_ENV = production
CLIENT_URL = https://your-app-name.vercel.app
```

**Note:** Set `VITE_API_URL` AFTER your app is deployed (so you know the Vercel URL)

### Step 2: Redeploy
After adding environment variables, trigger a new deployment:
- Push changes to GitHub, OR
- Go to Vercel Dashboard → Deployments → Click the 3 dots menu → "Redeploy"

### Step 3: Verify Database
After deployment, ensure your database schema is updated:

```bash
# Login to Vercel (if not already)
vercel login

# Link to your project
vercel link

# Pull environment variables locally
vercel env pull

# Push database schema
cd server
npx prisma db push

# (Optional) Seed database
npm run seed
```

## 🔍 Troubleshooting

### If you still get 404 errors:

1. **Check Vercel Build Logs:**
   - Go to Vercel Dashboard → Deployments → Click latest deployment
   - Look at "Build" and "Function" logs for errors

2. **Verify Environment Variables:**
   ```bash
   # Check what was deployed
   vercel env list
   ```

3. **Test API directly:**
   - Visit `https://your-app.vercel.app/api` - should show JSON response
   - Visit `https://your-app.vercel.app/health` - should return `{"status":"ok"}`

4. **Check Client-Side API URL:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Make any action that calls the API
   - Check the request URL - should be `https://your-app.vercel.app/api/...`

### Common Issues:

| Issue | Solution |
|-------|----------|
| `VITE_API_URL` not being used | Rebuild with `npm run build` after setting env var |
| API requests going to wrong URL | Ensure `VITE_API_URL` is set in Vercel before deployment |
| Database connection errors | Check `DATABASE_URL` is correct and Postgres is accessible |
| 500 errors on API calls | Check server logs in Vercel → Deployments → Function logs |

## 📝 Environment Variables Reference

### Client Variables (`client/.env`)
```dotenv
VITE_API_URL=https://your-app.vercel.app/api
```

### Server Variables (Vercel Dashboard)
```
DATABASE_URL=postgresql://user:password@host/database
SESSION_SECRET=your-secure-random-string
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
```

## ✨ After These Changes

1. Your frontend SPA will be served correctly for all routes
2. API requests will be routed to your server
3. 404 errors should be resolved
4. Both static and dynamic content will work properly

---

**Need more help?** Check:
- [Vercel Documentation](https://vercel.com/docs)
- [DEPLOYMENT.md](./DEPLOYMENT.md) in this repo
