
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    
    console.log(`Users: ${userCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Categories: ${categoryCount}`);
    
    if (productCount === 0) {
      console.log("NO PRODUCTS FOUND. Database needs seeding.");
    } else {
      console.log("Database has data.");
    }
  } catch (e) {
    console.error("Error connecting to database:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
