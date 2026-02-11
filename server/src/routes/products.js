const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// Mock data for fallback
const mockCategories = [
  { id: '1', name: 'Dogs', slug: 'dogs' },
  { id: '2', name: 'Cats', slug: 'cats' },
  { id: '3', name: 'Birds', slug: 'birds' },
  { id: '4', name: 'Fish', slug: 'fish' },
];

const mockProducts = [
  {
    id: '1',
    name: 'Premium Dog Food',
    description: 'Nutrient-rich kibble for adult dogs. Grain-free and packed with protein.',
    price: 54.99,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&w=500&q=80'],
    categoryId: '1',
    category: { id: '1', name: 'Dogs', slug: 'dogs' },
  },
  {
    id: '2',
    name: 'Durable Dog Leash',
    description: 'Heavy-duty retractable leash, extends up to 16ft.',
    price: 24.99,
    stock: 100,
    images: ['https://images.unsplash.com/photo-1597843786271-105124152c98?auto=format&fit=crop&w=500&q=80'],
    categoryId: '1',
    category: { id: '1', name: 'Dogs', slug: 'dogs' },
  },
  {
    id: '3',
    name: 'Plush Squeaky Toy',
    description: 'Soft and cuddly squeaky toy for dogs of all sizes.',
    price: 12.99,
    stock: 75,
    images: ['https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=500&q=80'],
    categoryId: '1',
    category: { id: '1', name: 'Dogs', slug: 'dogs' },
  },
  {
    id: '4',
    name: 'Premium Cat Food',
    description: 'High-protein cat food with essential amino acids.',
    price: 34.99,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&w=500&q=80'],
    categoryId: '2',
    category: { id: '2', name: 'Cats', slug: 'cats' },
  },
];

// Get all categories
router.get('/categories', async (req, res, next) => {
  try {
    console.log('Fetching categories from database...');
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    console.log(`Found ${categories.length} categories in database`);
    // Fallback to mock data if database is empty
    if (categories.length > 0) {
      return res.json(categories);
    }
  } catch (error) {
    console.error('Category fetch error - using mock data:', error.message);
  }
  
  // Return mock data as fallback
  console.log('Returning mock categories');
  res.json(mockCategories);
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
    console.log('Fetching products with query:', { category, search, page, limit });
    // Get total count for pagination
    const total = await prisma.product.count({ where });
    console.log(`Total products in database: ${total}`);
    
    // Get products
    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    });
    
    console.log(`Retrieved ${products.length} products from database`);
    
    // Fallback to mock data if database is empty
    if (products.length === 0 && total === 0) {
      console.log('Database empty - returning mock products');
      return res.json({
        products: mockProducts,
        pagination: {
          total: mockProducts.length,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: 1
        }
      });
    }
    
    return res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Product fetch error - using mock data:', error.message, error.stack);
    // Return mock data if database connection fails
    return res.json({
      products: mockProducts,
      pagination: {
        total: mockProducts.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: 1
      }
    });
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
      // Try mock data
      const mockProduct = mockProducts.find(p => p.id === id);
      if (mockProduct) {
        return res.json(mockProduct);
      }
      
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.json(product);
  } catch (error) {
    console.error('Product detail fetch error:', error.message);
    // Try to return mock data
    const mockProduct = mockProducts.find(p => p.id === id);
    if (mockProduct) {
      return res.json(mockProduct);
    }
    next(error);
  }
});

module.exports = router;
