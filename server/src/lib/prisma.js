const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Test database connection (non-blocking, logs but doesn't crash)
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((err) => {
    console.error('⚠️  Database connection warning:', err.message);
    console.log('⚠️  Proceeding with mock data fallback...');
  });

module.exports = prisma;
