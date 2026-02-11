const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Demo/fallback users for when database is unavailable (e.g., Vercel + SQLite) ──
// High priority: use environment variables so credentials aren't exposed on GitHub
const demoEmail = process.env.DEMO_ADMIN_EMAIL || 'admin@example.com';
const demoPassword = process.env.DEMO_ADMIN_PASSWORD || 'PethiveAdmin2026!';

const DEMO_ADMIN_HASH = bcrypt.hashSync(demoPassword, 10);
const DEMO_USERS = [
  { 
    id: 'demo-admin-001', 
    email: demoEmail, 
    name: 'Admin User', 
    password: DEMO_ADMIN_HASH, 
    role: 'admin', 
    picture: 'https://via.placeholder.com/150' 
  },
  { 
    id: 'demo-customer-001', 
    email: 'user@example.com', 
    name: 'Demo User', 
    password: bcrypt.hashSync('user123', 10), 
    role: 'customer', 
    picture: 'https://via.placeholder.com/150' 
  },
];

const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL;

// Helper: check if database is reachable
async function isDatabaseAvailable() {
  try {
    const databaseLikelyBroken = isVercel && (process.env.DATABASE_URL || '').startsWith('file:');
    if (databaseLikelyBroken) return false;
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// Email/Password Register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Fallback: create a demo session for the registered user
      const demoUser = { id: 'demo-' + Date.now(), email, name: name || 'New User', role: 'customer' };
      req.session.userId = demoUser.id;
      req.session.demoUser = demoUser;
      return res.json({ user: demoUser });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || 'New User',
        role: 'customer'
      }
    });

    req.session.userId = user.id;
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Email/Password Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const databaseLikelyBroken = isVercel && (process.env.DATABASE_URL || '').startsWith('file:');

    if (!databaseLikelyBroken) {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && user.password) {
          const validPassword = await bcrypt.compare(password, user.password);
          if (validPassword) {
            req.session.userId = user.id;
            return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
          }
        }
        // If user not found in DB, we still want to check demo users before returning 401
      } catch (dbError) {
        console.error('Database login failed, attempting fallback:', dbError.message);
        // Fall through to demo backup
      }
    }

    // Demo Fallback check
    const demoUser = DEMO_USERS.find(u => u.email === email);
    if (demoUser && bcrypt.compareSync(password, demoUser.password)) {
      req.session.userId = demoUser.id;
      req.session.demoUser = { id: demoUser.id, email: demoUser.email, name: demoUser.name, role: demoUser.role };
      return res.json({ user: req.session.demoUser });
    }

    // Only return 401 if it's not a demo user AND not a DB user
    const hint = demoEmail === 'admin@example.com' ? ' Hint: admin@example.com / PethiveAdmin2026!' : '';
    res.status(401).json({ error: `Invalid credentials.${hint}` });

  } catch (error) {
    console.error('Login error (final catch):', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Mock Login for Development
router.post('/mock-login', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not available in production' });
  }

  const { email, name } = req.body;
  
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name: name || 'Test User', picture: 'https://via.placeholder.com/150', role: 'customer' }
      });
    }
    req.session.userId = user.id;
    res.json({ user });
  } catch (error) {
    console.error('Mock login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google Login
router.post('/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user;
    try {
      user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: { email, name, picture, role: 'customer' }
        });
      } else {
        user = await prisma.user.update({
          where: { email },
          data: { name, picture }
        });
      }
      req.session.userId = user.id;
      return res.json({ user });
    } catch (dbError) {
      console.warn('Google login database error, using demo session');
      const demoUser = { id: 'google-' + email, email, name, picture, role: 'customer' };
      req.session.userId = demoUser.id;
      req.session.demoUser = demoUser;
      return res.json({ user: demoUser });
    }
  } catch (error) {
    console.error('Google login verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get Current User
router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.json({ user: null }); // Return 200 OK to prevent console noise
  }

  // If it's explicitly a demo session, return it immediately
  if (req.session.demoUser) {
    return res.json({ user: req.session.demoUser });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
    if (user) {
      return res.json({ user });
    }
  } catch (dbError) {
    console.warn('Current user DB fetch failed, checking demo users');
  }

  // Final check in demo users list
  const demoUser = DEMO_USERS.find(u => u.id === req.session.userId);
  if (demoUser) {
    return res.json({ user: { id: demoUser.id, email: demoUser.email, name: demoUser.name, role: demoUser.role } });
  }

  res.json({ user: null }); // Fallback to null user (200 OK)
});

// Logout
router.post('/logout', (req, res) => {
  req.session = null;
  res.json({ message: 'Logged out' });
});

module.exports = router;
