# ProductUniverse - Setup Guide

## 🚀 Quick Start (10 minutes)

### 1. Clone & Install
```bash
git clone <product-universe-repo>
cd product-universe
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Configure Your App
Edit `config/site.config.js`:

```javascript
export const siteConfig = {
  appName: "Your App Name",
  appType: "ecommerce", // or "streaming", "saas"
  
  modules: {
    ecommerce: true,  // Enable the modules you need
    streaming: false,
    chat: true
  },
  
  theme: {
    primary: "blue",  // Your brand color
    secondary: "purple"
  }
};
```

### 3. Setup Database
```bash
cd server
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate dev
npx prisma db seed
```

### 4. Launch
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Visit `http://localhost:5173` 🎉

---

## 📦 Available Modules

### E-Commerce Module
Perfect for: Online stores, marketplaces
- Product catalog with categories
- Shopping cart & checkout
- Order management
- Admin dashboard for inventory

**Enable:**
```javascript
modules: { ecommerce: true }
```

### Streaming Module (Coming Soon)
Perfect for: Netflix clones, course platforms
- Video library with playlists
- Custom player with quality selector
- Watch history & recommendations
- Subscription tiers

**Enable:**
```javascript
modules: { streaming: true }
```

### SaaS Module (Coming Soon)
Perfect for: Project management, CRM, dashboards
- Workspace/project management
- Team collaboration
- Analytics & reporting
- API key management

**Enable:**
```javascript
modules: { saas: true }
```

---

## 🎨 Switching Themes

Use pre-built presets:

```javascript
theme: {
  preset: "streaming"  // or "pet-shop", "electronics", "fashion", "saas"
}
```

Or customize:

```javascript
theme: {
  mode: "dark",
  primary: "purple",
  secondary: "pink"
}
```

---

## 📝 Example Configurations

### Pet Shop (Current)
```javascript
{
  appName: "OneStopPet",
  modules: { ecommerce: true, chat: true },
  theme: { preset: "pet-shop" }
}
```

### Netflix Clone
```javascript
{
  appName: "StreamFlix",
  modules: { streaming: true, chat: false },
  theme: { preset: "streaming" }
}
```

### Project Manager
```javascript
{
  appName: "TaskMaster",
  modules: { saas: true, chat: true },
  theme: { preset: "saas" }
}
```

---

## 🔧 Advanced: Creating Custom Modules

1. Create folder: `modules/my-module/`
2. Add `manifest.js`:
```javascript
export default {
  name: "my-module",
  routes: [{ path: "/my-page", component: "MyPage" }],
  adminPages: [{ name: "My Admin", path: "/admin/my-admin" }]
};
```
3. Enable in config:
```javascript
modules: { "my-module": true }
```

---

## 🐛 Troubleshooting

**Modules not loading?**
- Check `config/site.config.js` syntax
- Ensure module manifest exists
- Check browser console for errors

**Theme not applying?**
- Clear browser cache
- Restart dev server
- Verify color names are valid Tailwind colors

---

## 📚 Next Steps

- Add your own products/content
- Customize components in `client/src/components/`
- Deploy to production (see DEPLOYMENT.md)
- Explore more modules as they're released!

---

**Made your 2-day project reusable in 10 minutes!** 🎉
