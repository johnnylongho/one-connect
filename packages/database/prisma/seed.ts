import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  // Seed sample organization
  const org = await prisma.organization.upsert({
    where: { slug: 'one-khanh-hoa' },
    update: {},
    create: {
      name: 'StartUp Deal Day One Khánh Hòa',
      slug: 'one-khanh-hoa',
      status: 'ACTIVE',
    },
  });

  // Seed sample event
  const event = await prisma.event.upsert({
    where: { slug: 'startup-deal-day-2026' },
    update: {},
    create: {
      name: 'StartUp Deal Day One Khánh Hòa 2026',
      slug: 'startup-deal-day-2026',
      status: 'PUBLISHED',
      organizationId: org.id,
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 4), // 4 hours later
      createdBy: '00000000-0000-0000-0000-000000000000', // Mock UUID, real foreign key will fail if user doesn't exist
    },
  });

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
