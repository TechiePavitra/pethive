
console.log('🔧 Starting server initialization...');
const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
require('dotenv').config();

console.log('📝 DATABASE_URL:', process.env.DATABASE_URL);
const app = express();
const PORT = process.env.PORT || 3001;

// Import middleware
const logger = require('./middleware/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.CLIENT_URL || 'https://pethive-psi.vercel.app')
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'secret_key_change_in_production'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax'
}));

// Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(logger);
}

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'PetHive API' });
});

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date() });
});

// API Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'PetHive API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      admin: '/api/admin',
      chat: '/api/messages'
    }
  });
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/products');
app.use('/api', productRoutes);

const orderRoutes = require('./routes/orders');
app.use('/api', orderRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api', chatRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Only listen in development mode (not on Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 PetHive API server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
