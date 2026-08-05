import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const checkAdmins = async () => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { id: true, email: true, role: true }
    });
    console.log('Admin users found:');
    admins.forEach(a => console.log(`  - ${a.email} (id: ${a.id})`));
  } catch (err) {
    console.error('Database error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
};

checkAdmins();
