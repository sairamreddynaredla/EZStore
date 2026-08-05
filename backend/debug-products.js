import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function debug() {
  try {
    // Find product with name containing 'Me-O'
    const products = await prisma.product.findMany({
      where: {
        name: { contains: "Me-O", mode: "insensitive" },
      },
      select: { id: true, name: true, price: true, slug: true },
    });

    console.log("=== Products with 'Me-O' in name ===");
    products.forEach((p) =>
      console.log(`ID: ${p.id}, Name: ${p.name}, Price: ${p.price}, Slug: ${p.slug}`)
    );

    // Check if product 1404 exists
    const prod1404 = await prisma.product.findUnique({
      where: { id: 1404 },
      select: { id: true, name: true },
    });

    console.log(`\nProduct 1404 exists: ${prod1404 ? "YES" : "NO"}`);

    // Get product count and sample IDs
    const count = await prisma.product.count();
    console.log(`\nTotal products in database: ${count}`);

    const allProducts = await prisma.product.findMany({
      take: 20,
      select: { id: true, name: true },
      orderBy: { id: "desc" },
    });

    console.log(`\nSample products (last 20):`);
    allProducts.forEach((p) => console.log(`  ID: ${p.id}, Name: ${p.name.substring(0, 50)}`));

    // Find max ID
    const maxId = await prisma.product.findMany({
      orderBy: { id: "desc" },
      take: 1,
      select: { id: true },
    });

    console.log(`\nMax product ID: ${maxId[0]?.id || "N/A"}`);
  } finally {
    await prisma.$disconnect();
  }
}

debug().catch(console.error);
