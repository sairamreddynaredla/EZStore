import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'chandrasekharkomera18@gmail.com';
  
  const customer = await prisma.customer.findUnique({
    where: { email }
  });

  if (customer) {
    await prisma.customer.update({
      where: { email },
      data: { fullName: 'Chandrasekhar Komera' }
    });
    console.log('Customer name updated successfully.');
  } else {
    console.log('Customer not found.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
