const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// Middleware to check auth
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// Sync Cart
router.post('/cart', requireAuth, async (req, res) => {
  const { items } = req.body; // JSON string or object
  const userId = req.session.userId;

  try {
    const cart = await prisma.cart.upsert({
      where: { userId },
      update: { items: JSON.stringify(items) },
      create: { userId, items: JSON.stringify(items) }
    });
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to sync cart' });
  }
});

// Get Cart
router.get('/cart', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  try {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    res.json(cart ? JSON.parse(cart.items) : []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Create Order
router.post('/orders', requireAuth, async (req, res) => {
  const { items, total } = req.body;
  const userId = req.session.userId;

  try {
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'pending',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });
    
    // Clear cart after order
    await prisma.cart.delete({ where: { userId } }).catch(() => {});

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get User Orders
router.get('/orders', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
