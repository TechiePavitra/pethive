const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create Categories
  const categories = [
    { name: 'Dogs', slug: 'dogs' },
    { name: 'Cats', slug: 'cats' },
    { name: 'Birds', slug: 'birds' },
    { name: 'Fish', slug: 'fish' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const dogCategory = await prisma.category.findUnique({ where: { slug: 'dogs' } });
  const catCategory = await prisma.category.findUnique({ where: { slug: 'cats' } });

  // Create Products
  const products = [
    // Dogs
    {
      name: 'Premium Dog Food',
      description: 'Nutrient-rich kibble for adult dogs. Grain-free and packed with protein.',
      price: 54.99,
      stock: 50,
      images: JSON.stringify(['https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&w=500&q=80']),
      categoryId: dogCategory.id,
    },
    {
      name: 'Durable Dog Leash',
      description: 'Heavy-duty retractable leash, extends up to 16ft.',
      price: 24.99,
      stock: 100,
      images: JSON.stringify(['https://images.unsplash.com/photo-1597843786271-105124152c98?auto=format&fit=crop&w=500&q=80']),
      categoryId: dogCategory.id,
    },
    {
      name: 'Plush Squeaky Toy',
      description: 'Soft and cuddly squeaky toy for dogs of all sizes.',
      price: 12.99,
      stock: 75,
      images: JSON.stringify(['https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=500&q=80']),
      categoryId: dogCategory.id,
    },
    {
      name: 'Orthopedic Dog Bed',
      description: 'Memory foam bed for ultimate comfort and joint support.',
      price: 89.99,
      stock: 30,
      images: JSON.stringify(['https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=500&q=80']),
      categoryId: dogCategory.id,
    },
    {
      name: 'Indestructible Chew Ball',
      description: 'Tough rubber ball for aggressive chewers.',
      price: 15.99,
      stock: 120,
      images: JSON.stringify(['https://images.unsplash.com/photo-1549448103-64214a6018b1?auto=format&fit=crop&w=500&q=80']),
      categoryId: dogCategory.id,
    },
    {
      name: 'Dog Grooming Kit',
      description: 'Complete set with brush, nail clippers, and shampoo.',
      price: 34.99,
      isOffer: true,
      stock: 40,
      images: JSON.stringify(['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=500&q=80']),
      categoryId: dogCategory.id,
    },
    
    // Cats
    {
      name: 'Interactive Laser Toy',
      description: 'Automatic laser pointer to keep your cat entertained.',
      price: 19.99,
      stock: 45,
      images: JSON.stringify(['https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=500&q=80']),
      categoryId: catCategory.id,
    },
    {
      name: 'Cat Scratching Post',
      description: 'Sisal-wrapped scratching post with hanging ball.',
      price: 34.99,
      stock: 60,
      images: JSON.stringify(['https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=500&q=80']),
      categoryId: catCategory.id,
    },
    {
      name: 'Organic Catnip',
      description: 'Premium dried catnip leaves for euphoric playtime.',
      price: 8.99,
      discount: 10,
      stock: 150,
      images: JSON.stringify(['https://images.unsplash.com/photo-1615266895738-11f1371cd7e5?auto=format&fit=crop&w=500&q=80']),
      categoryId: catCategory.id,
    },
    {
      name: 'Modern Cat Tower',
      description: 'Multi-level cat tree with condos and perches.',
      price: 129.99,
      isOffer: true,
      stock: 15,
      images: JSON.stringify(['https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=500&q=80']),
      categoryId: catCategory.id,
    },
    {
      name: 'Automatic Cat Feeder',
      description: 'Programmable feeder to keep your kitty fed on time.',
      price: 69.99,
      stock: 25,
      images: JSON.stringify(['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=500&q=80']),
      categoryId: catCategory.id,
    },

    // Birds (New)
    {
      name: 'Large Bird Cage',
      description: 'Spacious iron cage suitable for parrots and cockatiels.',
      price: 149.99,
      stock: 10,
      images: JSON.stringify(['https://images.unsplash.com/photo-1552728089-57bdde30ebd1?auto=format&fit=crop&w=500&q=80']),
      categoryId: (await prisma.category.findUnique({ where: { slug: 'birds' } })).id,
    },
    {
      name: 'Bird Seed Mix',
      description: 'Nutritious blend of seeds and dried fruit.',
      price: 14.99,
      stock: 80,
      images: JSON.stringify(['https://images.unsplash.com/photo-1603013898634-19c286b24519?auto=format&fit=crop&w=500&q=80']),
      categoryId: (await prisma.category.findUnique({ where: { slug: 'birds' } })).id,
    },
    {
      name: 'Wooden Perch Swing',
      description: 'Natural wood swing for bird cages.',
      price: 9.99,
      stock: 50,
      images: JSON.stringify(['https://images.unsplash.com/photo-1497206365907-f5e1f31d4c63?auto=format&fit=crop&w=500&q=80']),
      categoryId: (await prisma.category.findUnique({ where: { slug: 'birds' } })).id,
    },

    // Fish (New)
    {
      name: '10 Gallon Aquarium Kit',
      description: 'Starter kit with tank, light, and filter.',
      price: 79.99,
      stock: 20,
      images: JSON.stringify(['https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=500&q=80']),
      categoryId: (await prisma.category.findUnique({ where: { slug: 'fish' } })).id,
    },
    {
      name: 'Tropical Fish Flakes',
      description: 'Complete diet for all tropical community fish.',
      price: 6.99,
      stock: 200,
      images: JSON.stringify(['https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=500&q=80']),
      categoryId: (await prisma.category.findUnique({ where: { slug: 'fish' } })).id,
    },
    {
      name: 'Aquarium Castle Decor',
      description: 'Resin castle ornament for fish to hide in.',
      price: 18.99,
      discount: 15,
      stock: 45,
      images: JSON.stringify(['https://images.unsplash.com/photo-1534043464124-3866f9191d4d?auto=format&fit=crop&w=500&q=80']),
      categoryId: (await prisma.category.findUnique({ where: { slug: 'fish' } })).id,
    },
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: prod,
    });
  }

  // Create Admin User
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
        password: hashedPassword, // Ensure password is set if user exists
        role: 'admin'
    },
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      password: hashedPassword,
      picture: 'https://via.placeholder.com/150',
    },
  });

  console.log('Seed data inserted');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
