# 🔐 Environment Variables Setup Guide

This document explains how to set up environment variables for PetHive.

## 📋 Quick Setup

### 1. Server Environment Variables

Copy the example file:
```bash
cp server/.env.example server/.env
```

Then edit `server/.env` and update:

#### Required Variables
- `DATABASE_URL` - Your database connection string
- `SESSION_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

#### Admin Credentials
⚠️ **IMPORTANT**: Default admin credentials are in `server/prisma/seed.js`
- Default email: `admin@example.com`
- Default password: `admin123`
- **Change these immediately in production!**

### 2. Client Environment Variables

Copy the example file:
```bash
cp client/.env.example client/.env
```

Then edit `client/.env` and update:
- `VITE_API_URL` - Your backend API URL

## 🔒 Security Best Practices

### Never Commit Real Credentials
- `.env` files are in `.gitignore` - keep it that way!
- Only commit `.env.example` files with placeholders
- Use `[HIDDEN]` or `[YOUR_VALUE]` as placeholders

### Generate Secure Secrets

**Session Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Random Password:**
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

### Production Checklist
- [ ] Change `SESSION_SECRET` to a random secure string
- [ ] Update `DATABASE_URL` to production database
- [ ] Change admin email and password
- [ ] Set `NODE_ENV=production`
- [ ] Update `CLIENT_URL` to production URL
- [ ] Update `VITE_API_URL` to production API URL
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins

## 🌐 Environment-Specific Configuration

### Local Development
```bash
# server/.env
DATABASE_URL="file:./prisma/dev.db"
SESSION_SECRET="dev-secret-change-in-production"
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# client/.env
VITE_API_URL=http://localhost:3001/api
```

### Production (Vercel)
```bash
# Set via Vercel Dashboard or CLI
DATABASE_URL="postgresql://user:pass@host:5432/db"
SESSION_SECRET="[64-character-random-string]"
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app

# client/.env
VITE_API_URL=https://your-app.vercel.app/api
```

## 📧 Admin Email & Password

### Default Credentials (Development)
Located in `server/prisma/seed.js`:
- Email: `admin@example.com`
- Password: `admin123`

### Changing Admin Credentials

**Option 1: Update seed file (before first run)**
Edit `server/prisma/seed.js`:
```javascript
const adminUser = await prisma.user.create({
  data: {
    email: 'your-admin@yourdomain.com',
    password: await bcrypt.hash('YourSecurePassword123!', 10),
    isAdmin: true,
  },
});
```

**Option 2: Update via database (after deployment)**
```bash
cd server
npx prisma studio
# Then manually update the admin user in the UI
```

**Option 3: Add environment variables (recommended)**
Add to `server/.env`:
```bash
ADMIN_EMAIL=your-admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!
```

Then update `server/prisma/seed.js` to use these:
```javascript
const adminUser = await prisma.user.create({
  data: {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'admin123',
      10
    ),
    isAdmin: true,
  },
});
```

## 🔑 Optional Services

### Email (SMTP)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@pethive.com
```

### Google OAuth
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

### Stripe Payments
```bash
# Server
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Client
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### File Storage (AWS S3)
```bash
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=pethive-uploads
```

## 🚨 Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` format
- Ensure PostgreSQL is running (if using PostgreSQL)
- Run `npx prisma db push` to sync schema

### "Session secret not set"
- Ensure `SESSION_SECRET` is defined in `server/.env`
- Generate a new one if needed

### "API calls failing"
- Verify `VITE_API_URL` matches your backend URL
- Check CORS settings in `server/src/app.js`
- Ensure backend server is running

### "Admin login not working"
- Verify database is seeded: `npm run seed`
- Check credentials in `server/prisma/seed.js`
- Clear browser cookies and try again

## 📚 Additional Resources

- [Prisma Environment Variables](https://www.prisma.io/docs/guides/development-environment/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Need help?** Open an issue on GitHub or contact [ADMIN_EMAIL_PLACEHOLDER]
