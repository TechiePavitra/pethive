const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const products = await prisma.product.findMany({ take: 2 });
    console.log('Products from API test:');
    console.log(JSON.stringify(products, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
