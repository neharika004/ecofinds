const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const pw = await bcrypt.hash('password', 10); // demo password
  const demo = await prisma.user.upsert({
    where: { email: 'demo@ecofinds.app' },
    update: {},
    create: { email: 'demo@ecofinds.app', username: 'demouser', password: pw }
  });

  const categories = ['Clothing', 'Electronics', 'Home', 'Books', 'Sports'];

  for (let i = 1; i <= 6; i++) {
    await prisma.listing.create({
      data: {
        title: `Sample Item ${i}`,
        description: `Gently used item number ${i}. Still works great! Great condition and ready for reuse.`,
        category: categories[i % categories.length],
        price: 100 + i * 10,
        userId: demo.id
      }
    });
  }

  console.log('Seed complete');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
