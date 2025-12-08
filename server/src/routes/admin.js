const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  
  const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
};

router.use(isAdmin);

// Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count();
    
    const orders = await prisma.order.findMany({
      include: { items: true }
    });
    
    const totalSales = orders.reduce((acc, order) => acc + order.total, 0);

    // Top Selling Products logic
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { name: '', count: 0, revenue: 0 };
        }
        productSales[item.productId].count += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    // Populate names (could be optimized with a direct query grouping)
    // For now getting all products to map names might be okay for small scale, 
    // but better to rely on what we have. We need product names.
    // Let's do a quick fetch of top products by ID or just send what we have if we included products in order items.
    // Actually OrderItem has product relation. Let's include that in the query above? 
    // Optimization: Let's simpler fetch.
    
    // Efficient way:
    const topSelling = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });
    
    // Now fetch product details for these top sellers
    const topProductsWithDetails = await Promise.all(
        topSelling.map(async (item) => {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
                select: { name: true }
            });
            return {
                name: product ? product.name : 'Unknown Product',
                sales: item._sum.quantity
            };
        })
    );

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalSales,
      topSelling: topProductsWithDetails
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// --- Product Management ---

// Add Product
router.post('/products', async (req, res) => {
  const { name, description, price, categoryId, images, stock, discount, isOffer } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        name, description, price: parseFloat(price), 
        categoryId, images: JSON.stringify(images), 
        stock: parseInt(stock), discount: parseFloat(discount || 0), isOffer: !!isOffer
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update Product (e.g. Discount)
router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { discount, price, isOffer, stock } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id },
      data: { 
        ...(discount !== undefined && { discount: parseFloat(discount) }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(isOffer !== undefined && { isOffer: !!isOffer }),
        ...(stock !== undefined && { stock: parseInt(stock) })
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete Product
router.delete('/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// --- Chat / Messages ---

// Get all messages (for admin view)
router.get('/messages', async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      include: { user: { select: { email: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a reply (or message as admin)
router.post('/messages', async (req, res) => {
  const { content, userId } = req.body; // If replying to specific user
  try {
    const message = await prisma.message.create({
      data: {
        content,
        userId: userId || req.session.userId, // If replying, map to that user? Or just global chat?
        // For simplicity, let's assume it's a global chat or direct reply if we have structure.
        // Concept: Admin simply posts a message.
        isAdmin: true
      }
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Delete a message (Admin)
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.message.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Clear all messages (Admin)
router.delete('/messages', async (req, res) => {
  try {
    await prisma.message.deleteMany(); // Deletes ALL messages
    res.json({ message: 'All messages cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear chat' });
  }
});

// --- Category Management ---

// Add Category
router.post('/categories', async (req, res) => {
  const { name, slug } = req.body;
  try {
    // Basic slug generation if not provided
    const finalSlug = slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    const category = await prisma.category.create({
      data: { name, slug: finalSlug }
    });
    res.json(category);
  } catch (error) {
    // Check for unique constraint violation on slug
    if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Category with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Delete Category
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Optional: Check if products exist in this category before deleting?
    // For now, let's assume we can delete, but Prisma might throw if restricted. 
    // Schema relation is simple, verify if we need cascade or not.
    // Ideally we should warn user, but for "concept" simple delete is okay if empty.
    
    // Better: Check for products
    const productsCount = await prisma.product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
        return res.status(400).json({ error: 'Cannot delete category with existing products' });
    }

    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Update Category
router.put('/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { name, slug } = req.body;
  
  try {
     const finalSlug = slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
     
     const category = await prisma.category.update({
        where: { id },
        data: { name, slug: finalSlug }
     });
     res.json(category);
  } catch (error) {
     if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Slug already exists' });
     }
     res.status(500).json({ error: 'Failed to update category' });
  }
});

module.exports = router;
