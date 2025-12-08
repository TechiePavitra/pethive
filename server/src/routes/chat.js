const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// Get my messages (for logged in user)
router.get('/messages', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Login required' });

  try {
    const messages = await prisma.message.findMany({
      where: { userId: req.session.userId },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/messages', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Login required' });
  
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content required' });

  try {
    const message = await prisma.message.create({
      data: {
        content,
        userId: req.session.userId,
        isAdmin: false
      }
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Update a message
router.put('/messages/:id', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Login required' });
  const { id } = req.params;
  const { content } = req.body;

  try {
    const message = await prisma.message.findUnique({ where: { id } });
    if (!message || message.userId !== req.session.userId) {
        return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.message.update({
        where: { id },
        data: { content }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Delete a message
router.delete('/messages/:id', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Login required' });
  const { id } = req.params;

  try {
    const message = await prisma.message.findUnique({ where: { id } });
    if (!message || message.userId !== req.session.userId) {
        return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.message.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Clear all my messages
router.delete('/messages', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Login required' });

  try {
    await prisma.message.deleteMany({
        where: { userId: req.session.userId }
    });
    res.json({ message: 'Chat cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear chat' });
  }
});

module.exports = router;
