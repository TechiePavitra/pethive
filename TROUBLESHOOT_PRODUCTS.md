# Troubleshooting: Products Not Loading

## Step 1: Check If Backend is Running

**Open your browser and visit:**
```
https://pethive-psi.vercel.app/health
```

You should see:
```json
{"status":"ok","service":"PetHive API"}
```

### If you see this:
- ✅ Backend is running
- ✅ Go to Step 2

### If you see an error or 404:
- ❌ Backend is not responding
- 🔧 Fix: Check Vercel logs (see "Check Vercel Logs" section below)

---

## Step 2: Check Database Connection

**Visit:**
```
https://pethive-psi.vercel.app/api/categories
```

You should see a JSON array like:
```json
[
  {"id":"1","name":"Dogs","slug":"dogs"},
  {"id":"2","name":"Cats","slug":"cats"},
  ...
]
```

### If you see products/categories:
- ✅ Database is connected and seeded
- ✅ Problem might be on frontend - go to Step 4

### If you see empty array `[]`:
- ❌ Database exists but is empty
- 🔧 Fix: Run seed manually (see "Reseed Database" section)

### If you see error or 500:
- ❌ Database connection failed
- 🔧 Fix: Check Vercel logs (see section below)

---

## Step 3: Check Browser Console

1. Open https://pethive-psi.vercel.app
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Look for red error messages

### Common Errors:

**"Failed to load products. Please make sure the backend server is running."**
- The `/api/products` request failed
- Check `/health` endpoint from Step 1

**"Network error: 404"**
- Endpoint doesn't exist
- Check vercel.json routing

**"CORS error"**
- Backend CORS settings don't match frontend
- Contact developer

---

## Step 4: Check Vercel Function Logs

**Important:** This is the most helpful for diagnosis.

1. Go to https://vercel.com/dashboard
2. Click **pethive** project
3. Go to **Deployments** tab
4. Click on the **latest deployment** (should be gray/black with ✓ or ✗)
5. Click **Logs** tab on the right
6. Look for error messages

**What to look for:**
- "DATABASE_URL" errors
- "ENOENT" (file not found)
- "Connection refused"
- "Prisma" errors

**Copy and paste any errors you see here.**

---

## Step 5: Reseed Database

If database is empty (`[]` from Step 2), manually seed it:

### Option A: Via GitHub Actions (Recommended)

1. Go to https://github.com/TechiePavitra/pethive/actions
2. Find **Deploy to Vercel** workflow
3. Click **Run workflow** button
4. Select **main** branch
5. Click **Run workflow**
6. Wait for it to complete
7. Check `/api/categories` again

### Option B: Manually (Advanced)

If you have local access to Vercel project:
```bash
cd server
DATABASE_URL="file:./dev.db" npm run seed
```

---

## Step 6: Check Environment Variables Again

Go back to https://vercel.com/dashboard → pethive → Settings → Environment Variables

Verify all 4 exist:
- [ ] `NODE_ENV` = `production`
- [ ] `CLIENT_URL` = `https://pethive-psi.vercel.app`
- [ ] `DATABASE_URL` = `file:./dev.db` (or your PostgreSQL URL)
- [ ] `SESSION_SECRET` = (some hex string)

**Missing any?** Add them and redeploy again.

---

## Complete Diagnostic Checklist

- [ ] `/health` returns `{"status":"ok",...}`
- [ ] `/api/categories` returns array with items
- [ ] `/api/products` returns products
- [ ] Browser console has no red errors
- [ ] Environment variables all present in Vercel
- [ ] Latest deployment completed successfully

If still not working:

1. **Screenshot the `/health` endpoint response**
2. **Screenshot the `/api/categories` response**
3. **Copy the error from browser console**
4. **Copy the error from Vercel function logs**

Then provide these details for debugging.

---

## Common Solutions

### "DATABASE_URL resolved to an empty string"
- Variable not set or set to empty value
- Check Vercel environment variables again

### "ENOENT: no such file or directory './dev.db'"
- Database file doesn't exist
- Run seed script
- Or use PostgreSQL instead

### "Cannot find module 'prisma'"
- Dependencies not installed
- Trigger a redeploy

### Empty products list
- Database not seeded
- Run Step 5 (reseed database)

---

## Next: Still Not Working?

Provide:
1. Screenshot of `/health` endpoint
2. Screenshot of `/api/categories` endpoint  
3. Error message from browser console
4. Last line from Vercel function logs

Then we can debug the specific issue.
