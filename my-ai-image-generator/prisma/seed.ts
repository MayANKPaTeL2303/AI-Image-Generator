import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.image.createMany({
    data: [
      {
        prompt: 'A futuristic city skyline at sunset',
        imageUrl: 'https://example.com/images/future-city.jpg',
      },
      {
        prompt: 'A cat sitting on the moon',
        imageUrl: 'https://example.com/images/cat-moon.jpg',
      },
      {
        prompt: 'Mountains covered in neon lights',
        imageUrl: 'https://example.com/images/neon-mountains.jpg',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
