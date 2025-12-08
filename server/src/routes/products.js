const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// Get all categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Get all products with filters and pagination
router.get('/products', async (req, res, next) => {
  const { category, search, page = 1, limit = 50 } = req.query;
  
  const where = {};
  
  // Category filter
  if (category) {
    where.category = { slug: category };
  }
  
  // Search filter (case-insensitive for PostgreSQL)
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  try {
    // Get total count for pagination
    const total = await prisma.product.count({ where });
    
    // Get products
    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    });
    
    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single product
router.get('/products/:id', async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });
    
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.json(product);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
