import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanup() {
  try {
    // Get all valid product IDs
    const validProducts = await prisma.product.findMany({
      select: { id: true },
    });
    const validIds = new Set(validProducts.map(p => p.id));

    // Find all cart items
    const allCartItems = await prisma.cartItem.findMany({
      include: { customer: { select: { id: true, email: true } }, product: { select: { id: true, name: true } } },
    });

    // Find orphaned items (where productId doesn't exist)
    const orphanedItems = allCartItems.filter(item => !validIds.has(item.productId));

    console.log(`Database State:`);
    console.log(`  Valid products: ${validIds.size}`);
    console.log(`  Total cart items: ${allCartItems.length}`);
    console.log(`  Orphaned cart items: ${orphanedItems.length}`);

    if (orphanedItems.length > 0) {
      console.log(`\nOrphaned items detail:`);
      orphanedItems.forEach(item => {
        console.log(`  ID: ${item.id}, Product ID: ${item.productId}, Customer: ${item.customer.email}`);
      });

      // Delete orphaned items
      const result = await prisma.cartItem.deleteMany({
        where: {
          id: { in: orphanedItems.map(i => i.id) },
        },
      });
      console.log(`\n✓ Deleted ${result.count} orphaned cart items`);
    }

    // Verify cleanup
    const remaining = await prisma.cartItem.findMany({
      include: { customer: { select: { email: true } }, product: { select: { name: true } } },
    });
    console.log(`\n✓ Cart items after cleanup: ${remaining.length}`);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup().catch(console.error);
