import prisma from './src/database/prismaClient.js';

async function cleanupDuplicates() {
  try {
    // Remove duplicate wishlist items, keeping only the first one
    const wishlistDupes = await prisma.wishlistItem.groupBy({
      by: ['customerId', 'productId'],
      having: { id: { _count: { gt: 1 } } },
    });

    console.log('Found', wishlistDupes.length, 'duplicate wishlist groups');

    for (const group of wishlistDupes) {
      const items = await prisma.wishlistItem.findMany({
        where: { customerId: group.customerId, productId: group.productId },
        orderBy: { id: 'asc' },
      });
      if (items.length > 1) {
        await prisma.wishlistItem.deleteMany({
          where: { id: { in: items.slice(1).map(i => i.id) } },
        });
        console.log('Deleted', items.length - 1, 'duplicates for customer', group.customerId, 'product', group.productId);
      }
    }

    // Remove duplicate saved items
    const savedDupes = await prisma.savedItem.groupBy({
      by: ['customerId', 'productId'],
      having: { id: { _count: { gt: 1 } } },
    });

    console.log('Found', savedDupes.length, 'duplicate saved item groups');

    for (const group of savedDupes) {
      const items = await prisma.savedItem.findMany({
        where: { customerId: group.customerId, productId: group.productId },
        orderBy: { id: 'asc' },
      });
      if (items.length > 1) {
        await prisma.savedItem.deleteMany({
          where: { id: { in: items.slice(1).map(i => i.id) } },
        });
        console.log('Deleted', items.length - 1, 'saved duplicates for customer', group.customerId, 'product', group.productId);
      }
    }

    // Remove duplicate recently viewed items
    const recentlyViewedDupes = await prisma.recentlyViewedItem.groupBy({
      by: ['customerId', 'productId'],
      having: { id: { _count: { gt: 1 } } },
    });

    console.log('Found', recentlyViewedDupes.length, 'duplicate recently viewed groups');

    for (const group of recentlyViewedDupes) {
      const items = await prisma.recentlyViewedItem.findMany({
        where: { customerId: group.customerId, productId: group.productId },
        orderBy: { id: 'asc' },
      });
      if (items.length > 1) {
        await prisma.recentlyViewedItem.deleteMany({
          where: { id: { in: items.slice(1).map(i => i.id) } },
        });
        console.log('Deleted', items.length - 1, 'recently viewed duplicates for customer', group.customerId, 'product', group.productId);
      }
    }

    console.log('Cleanup complete');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicates();
