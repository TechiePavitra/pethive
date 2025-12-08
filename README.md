# 🐾 PetHive - Premium Pet E-Commerce Platform

A modern, full-stack e-commerce platform for pet supplies built with React, Express, and PostgreSQL. Features a beautiful UI, comprehensive product catalog, user authentication, shopping cart, and admin dashboard.

![PetHive Hero](https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80)

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog** - Browse products for Dogs, Cats, Birds, and Fish
- **Category Filtering** - Filter products by pet type
- **Search Functionality** - Find products quickly
- **Shopping Cart** - Add, remove, and manage cart items
- **User Authentication** - Register and login securely
- **Responsive Design** - Works perfectly on all devices
- **Beautiful UI** - Modern design with smooth animations

### 👨‍💼 Admin Features
- **Dashboard** - Sales analytics and insights
- **Product Management** - Add, edit, and delete products
- **Category Management** - Manage product categories
- **Order Management** - View and manage customer orders
- **Customer Support Chat** - Communicate with customers

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with Hooks
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Helmet Async** - SEO management

### Backend
- **Express.js** - Fast, minimalist web framework
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Production database
- **SQLite** - Development database
- **Bcrypt.js** - Password hashing
- **Cookie Session** - Session management

## 📋 Prerequisites

- Node.js 16+ and npm
- PostgreSQL (for production) or SQLite (for development)
- Git

## 🛠️ Local Development Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd project-universe
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 3. Configure Environment Variables

**Server (.env in server/ directory):**
```bash
# For local development with SQLite
DATABASE_URL="file:./prisma/dev.db"

# For PostgreSQL (production)
# DATABASE_URL="postgresql://username:password@localhost:5432/pethive"

SESSION_SECRET="your-super-secret-session-key"
PORT=3001
NODE_ENV=development
```

**Client (.env in client/ directory):**
```bash
VITE_API_URL=http://localhost:3001/api
```

### 4. Set Up Database
```bash
cd server

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with sample data
npm run seed
```

### 5. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` to see the app! 🎉

### 6. Test Admin Access
- Email: `admin@example.com`
- Password: `admin123`

## 📦 Production Deployment (Vercel)

### 1. Prerequisites
- Vercel account
- GitHub repository
- Vercel Postgres database (or external PostgreSQL)

### 2. Database Setup
1. Create a Postgres database on Vercel or use external provider (Neon, Supabase, etc.)
2. Get your `DATABASE_URL`

### 3. Deploy to Vercel

**Option A: Via Vercel Dashboard**
1. Import your GitHub repository
2. Vercel will auto-detect the project
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `SESSION_SECRET` - Random secure string
   - `CLIENT_URL` - Your frontend URL (e.g., https://your-app.vercel.app)
   - `NODE_ENV` - Set to `production`
4. Deploy!

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add SESSION_SECRET
vercel env add CLIENT_URL
vercel env add NODE_ENV

# Deploy to production
vercel --prod
```

### 4. Update Frontend API URL
In `client/.env`:
```bash
VITE_API_URL=https://your-app.vercel.app/api
```

Redeploy after updating.

### 5. Run Database Migration
After deployment, run migrations:
```bash
# Via Vercel CLI
vercel env pull
cd server
npx prisma db push
npm run seed
```

## 🗂️ Project Structure

```
project-universe/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── lib/           # Utilities and API client
│   │   └── layouts/       # Layout components
│   ├── public/            # Static assets
│   └── index.html         # Entry HTML file
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── lib/           # Utilities
│   │   └── app.js         # Express application
│   └── prisma/
│       ├── schema.prisma  # Database schema
│       └── seed.js        # Seed data
├── vercel.json            # Vercel configuration
└── README.md              # This file
```

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- CORS configuration
- Security headers (XSS protection, CSRF, etc.)
- Environment variable management
- SQL injection protection via Prisma ORM

## 🎨 UI/UX Features

- Modern, clean design
- Smooth animations with Framer Motion
- Responsive on all devices
- Loading states and error handling
- Accessible (ARIA labels)
- SEO optimized

## 📱 SEO Optimization

- Comprehensive meta tags
- Open Graph tags for social sharing
- Twitter Card support
- Sitemap.xml
- Robots.txt
- Semantic HTML
- Fast load times

## 🧪 Testing Locally

1. Start both servers (backend & frontend)
2. Visit `http://localhost:5173`
3. Test features:
   - Browse products
   - Search and filter
   - Add to cart
   - Register/Login
   - Admin dashboard (login as admin)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for learning or your portfolio!

## 👨‍💻 Author

Created with ❤️ for pet lovers everywhere

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running (if using PostgreSQL)
- Run `npx prisma db push` to sync schema

### Products Not Loading
- Ensure backend server is running on port 3001
- Check `VITE_API_URL` in client/.env
- Verify database is seeded with `npm run seed`

### Login Not Working
- Check SESSION_SECRET is set
- Clear browser cookies
- Verify user exists in database

## 🔗 Links

- [Live Demo](https://your-app.vercel.app)
- [GitHub Repository](https://github.com/yourusername/pethive)

---

**Made with 🐾 by PetHive Team**
