import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@systemly.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@systemly.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create regular users
  const userPassword = await bcrypt.hash('user123', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'john@systemly.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@systemly.com',
      password: userPassword,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@systemly.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@systemly.com',
      password: userPassword,
      role: 'USER',
    },
  });

  // Create systems
  const system1 = await prisma.system.create({
    data: {
      name: 'HR Management System',
      description: 'Internal HR system for managing employee records, leave requests, and performance reviews.',
      approved: true,
      ownerId: admin.id,
    },
  });

  const system2 = await prisma.system.create({
    data: {
      name: 'Finance Portal',
      description: 'Financial management system for invoicing, expenses, and reporting.',
      approved: true,
      ownerId: admin.id,
    },
  });

  const system3 = await prisma.system.create({
    data: {
      name: 'Project Tracker',
      description: 'Project management tool for tracking tasks, milestones, and team collaboration.',
      approved: false,
      ownerId: user1.id,
    },
  });

  // Assign users to systems
  await prisma.systemUser.createMany({
    data: [
      { systemId: system1.id, userId: admin.id },
      { systemId: system1.id, userId: user1.id },
      { systemId: system1.id, userId: user2.id },
      { systemId: system2.id, userId: admin.id },
      { systemId: system2.id, userId: user2.id },
      { systemId: system3.id, userId: user1.id },
    ],
  });

  console.log('Database seeded successfully!');
  console.log('Admin credentials: admin@systemly.com / admin123');
  console.log('User credentials: john@systemly.com / user123');
  console.log('User credentials: jane@systemly.com / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
