const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Email/Password Register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
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
        role: 'customer' // Default role
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
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
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
        data: {
          email,
          name: name || 'Test User',
          picture: 'https://via.placeholder.com/150',
          role: 'customer'
        }
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

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          picture,
          role: 'customer'
        }
      });
    } else {
      // Update user info
      user = await prisma.user.update({
        where: { email },
        data: { name, picture }
      });
    }

    req.session.userId = user.id;
    res.json({ user });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get Current User
router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session = null;
  res.json({ message: 'Logged out' });
});

module.exports = router;
