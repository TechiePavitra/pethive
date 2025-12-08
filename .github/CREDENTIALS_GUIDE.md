# 🔐 Credentials & Secrets Management Guide

This guide explains how credentials and sensitive information are managed in PetHive.

## 🎯 Overview

All sensitive information has been **HIDDEN** from the repository for security purposes. This includes:
- Database credentials
- Session secrets
- Admin email and password
- API keys
- OAuth credentials

## 📋 Where Credentials Are Used

### 1. Database Connection
**Location**: `server/.env`
```bash
DATABASE_URL="[HIDDEN]"
```

**How to set**:
- Local: `DATABASE_URL="file:./prisma/dev.db"`
- Production: `DATABASE_URL="postgresql://user:pass@host:5432/db"`

### 2. Session Secret
**Location**: `server/.env`
```bash
SESSION_SECRET="[HIDDEN]"
```

**How to generate**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Admin Credentials
**Location**: `server/prisma/seed.js`

**Default values** (for development only):
- Email: `admin@example.com`
- Password: `admin123`

**⚠️ CRITICAL**: Change these immediately in production!

**How to change**:

#### Option A: Environment Variables (Recommended)
Add to `server/.env`:
```bash
ADMIN_EMAIL=your-admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!
```

Then update `server/prisma/seed.js`:
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

#### Option B: Direct Edit
Edit `server/prisma/seed.js` directly:
```javascript
const adminUser = await prisma.user.create({
  data: {
    email: 'your-admin@yourdomain.com',
    password: await bcrypt.hash('YourSecurePassword123!', 10),
    isAdmin: true,
  },
});
```

#### Option C: Prisma Studio (Post-deployment)
```bash
cd server
npx prisma studio
# Update admin user in the web UI
```

## 🔒 Security Best Practices

### ✅ DO:
- Use `.env` files for all secrets
- Generate strong, random secrets
- Use different credentials for dev/staging/prod
- Rotate credentials regularly
- Use environment-specific values
- Keep `.env` in `.gitignore`

### ❌ DON'T:
- Commit `.env` files to Git
- Share credentials in chat/email
- Use default credentials in production
- Hardcode secrets in source code
- Reuse passwords across environments
- Store secrets in plain text

## 🌍 Environment-Specific Setup

### Local Development
```bash
# server/.env
DATABASE_URL="file:./prisma/dev.db"
SESSION_SECRET="dev-secret-change-in-production"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

### Staging
```bash
# server/.env (or via hosting platform)
DATABASE_URL="postgresql://staging_user:staging_pass@staging-db:5432/pethive_staging"
SESSION_SECRET="[64-char-random-string]"
ADMIN_EMAIL="admin@staging.yourdomain.com"
ADMIN_PASSWORD="[Strong-Password-123!]"
```

### Production
```bash
# Set via Vercel/hosting platform dashboard
DATABASE_URL="postgresql://prod_user:prod_pass@prod-db:5432/pethive"
SESSION_SECRET="[Different-64-char-random-string]"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="[Different-Strong-Password-456!]"
```

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Generate new `SESSION_SECRET`
- [ ] Set production `DATABASE_URL`
- [ ] Change admin email from default
- [ ] Change admin password from default
- [ ] Update `CLIENT_URL` to production URL
- [ ] Update `VITE_API_URL` to production API
- [ ] Verify all secrets are set in hosting platform
- [ ] Test admin login with new credentials
- [ ] Remove any development credentials
- [ ] Enable HTTPS
- [ ] Set `NODE_ENV=production`

## 📧 Admin Email Configuration

The admin email is used for:
- Initial admin account login
- Security notifications
- Support contact
- GitHub issue contact

**Where to update**:
1. `server/.env` - `ADMIN_EMAIL` variable
2. `server/prisma/seed.js` - Admin user creation
3. `.github/SECURITY.md` - Replace `[ADMIN_EMAIL_PLACEHOLDER]`
4. `.github/CODE_OF_CONDUCT.md` - Replace `[ADMIN_EMAIL_PLACEHOLDER]`
5. `.github/CONTRIBUTING.md` - Replace `[ADMIN_EMAIL_PLACEHOLDER]`
6. `.github/ENV_SETUP.md` - Replace `[ADMIN_EMAIL_PLACEHOLDER]`

**Search and replace**:
```bash
# Find all instances
grep -r "ADMIN_EMAIL_PLACEHOLDER" .github/

# Replace with your email (Linux/Mac)
find .github/ -type f -exec sed -i 's/\[ADMIN_EMAIL_PLACEHOLDER\]/your-email@domain.com/g' {} +

# Replace with your email (Windows PowerShell)
Get-ChildItem -Path .github -Recurse -File | ForEach-Object {
    (Get-Content $_.FullName) -replace '\[ADMIN_EMAIL_PLACEHOLDER\]', 'your-email@domain.com' | Set-Content $_.FullName
}
```

## 🔑 GitHub Secrets Setup

For CI/CD workflows, add these secrets in GitHub:
**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VERCEL_TOKEN` | Vercel deployment token | `ABC123...` |
| `DATABASE_URL` | Production database URL | `postgresql://...` |
| `SESSION_SECRET` | Session encryption key | `64-char-hex-string` |

## 🆘 Emergency Procedures

### If Credentials Are Compromised:

1. **Immediately rotate all secrets**:
   ```bash
   # Generate new session secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Change admin password**:
   ```bash
   cd server
   npx prisma studio
   # Update password in UI
   ```

3. **Update database credentials** (if database was exposed)

4. **Revoke and regenerate API keys**

5. **Review access logs** for suspicious activity

6. **Notify users** if user data was potentially exposed

### If `.env` Was Committed to Git:

1. **Remove from Git history**:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch server/.env" \
     --prune-empty --tag-name-filter cat -- --all
   ```

2. **Rotate all credentials** immediately

3. **Force push** (if safe to do so):
   ```bash
   git push origin --force --all
   ```

4. **Consider the repository compromised** and rotate everything

## 📚 Additional Resources

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [12-Factor App: Config](https://12factor.net/config)

## 🤔 Questions?

For security-related questions, contact: **[ADMIN_EMAIL_PLACEHOLDER]**

---

**Remember**: Security is everyone's responsibility! 🔒
