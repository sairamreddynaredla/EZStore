import bcrypt from "bcrypt";
import * as fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import vm from "vm";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const sampleCategories = [
  {
    name: "Pet Supplies",
    slug: "pet-supplies",
    description: "Everyday essentials for pet parents.",
    status: "active",
    banner: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
  },
];

const sampleBrands = [
  {
    name: "EZStore",
    slug: "ezstore",
    description: "EZStore branded essentials for pets and lifestyle.",
    status: "active",
  },
];

const sampleProducts = [
  {
    name: "Premium Cat Litter",
    slug: "premium-cat-litter",
    description: "Odor-control litter for modern homes.",
    price: 24.99,
    stock: 18,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=800&q=80",
    tags: ["litter", "pet"],
    metadata: { weight: "10kg", material: "clay" },
    categorySlug: "pet-supplies",
    brandSlug: "ezstore",
  },
  {
    name: "Luxury Dog Bed",
    slug: "luxury-dog-bed",
    description: "Orthopedic comfort for your best friend.",
    price: 79.5,
    stock: 6,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    tags: ["dog", "bed"],
    metadata: { dimensions: "120x80cm", material: "memory foam" },
    categorySlug: "pet-supplies",
    brandSlug: "ezstore",
  },
];

const sampleCustomers = [
  {
    email: "ava@example.com",
    password: "Customer@123",
    firstName: "Ava",
    lastName: "Martinez",
    phone: "+1 555 0100",
    emailVerified: true,
  },
];

const sampleOrders = [
  {
    orderNumber: "ORD-1001",
    status: "processing",
    totalAmount: 104.49,
    items: [
      { productSlug: "premium-cat-litter", name: "Premium Cat Litter", quantity: 1, unitPrice: 24.99 },
      { productSlug: "luxury-dog-bed", name: "Luxury Dog Bed", quantity: 1, unitPrice: 79.5 },
    ],
    paymentMethod: "card",
    paymentStatus: "paid",
    currency: "USD",
    orderDate: new Date().toISOString(),
  },
];

const loadFrontendProducts = async () => {
  const entryFile = path.resolve(process.cwd(), "../frontend/src/data/products.js");
  if (!fs.existsSync(entryFile)) return [];

  const moduleCache = new Map();

  const loadModuleSync = (filePath) => {
    const absolutePath = path.resolve(filePath);
    const candidates = path.extname(absolutePath)
      ? [absolutePath]
      : [absolutePath, `${absolutePath}.js`, `${absolutePath}.mjs`, path.join(absolutePath, "index.js"), path.join(absolutePath, "index.mjs")];
    const normalized = candidates.find((candidate) => fs.existsSync(candidate));
    if (!normalized) {
      throw new Error(`Cannot resolve module: ${filePath}`);
    }
    if (fs.statSync(normalized).isDirectory()) {
      return loadModuleSync(path.join(normalized, "index.js"));
    }
    if (moduleCache.has(normalized)) return moduleCache.get(normalized);

    const code = fs.readFileSync(normalized, "utf8");
    const moduleDir = path.dirname(normalized);
    const module = { exports: {} };

    const requireFn = (importPath) => {
      const resolvedPath = path.resolve(moduleDir, importPath);
      const candidates = [resolvedPath, `${resolvedPath}.js`, path.join(resolvedPath, "index.js")];
      const actualPath = candidates.find((candidate) => fs.existsSync(candidate));
      if (!actualPath) {
        throw new Error(`Cannot resolve import: ${importPath} from ${normalized}`);
      }

      const ext = path.extname(actualPath).toLowerCase();
      if ([".webp", ".png", ".jpg", ".jpeg", ".svg", ".gif"].includes(ext)) {
        return importPath;
      }

      return loadModuleSync(actualPath);
    };

    const importRegex = /(^|\n)import\s+([^'";]+?)\s+from\s+['"]([^'"]+)['"];?/g;
    const transformImportClause = (imports, importPath) => {
      const ext = path.extname(importPath).toLowerCase();
      const isAsset = [".webp", ".png", ".jpg", ".jpeg", ".svg", ".gif"].includes(ext);
      if (isAsset) {
        if (imports.trim().startsWith("{")) {
          return `const ${imports} = {};`;
        }
        return `const ${imports.trim()} = ${JSON.stringify(importPath)};`;
      }

      const clause = imports.trim();
      if (clause.startsWith("{")) {
        const body = clause.slice(1, -1).trim();
        const specifiers = body.split(",").map((specifier) => specifier.trim()).filter(Boolean);
        const assignments = specifiers.map((specifier) => {
          const [left, right] = specifier.split(/\s+as\s+/).map((item) => item.trim());
          return right ? `${left}: ${right}` : left;
        });
        return `const { ${assignments.join(", ")} } = require(${JSON.stringify(importPath)});`;
      }

      if (clause.startsWith("* as ")) {
        return `const ${clause.slice(5).trim()} = require(${JSON.stringify(importPath)});`;
      }

      return `const ${clause} = require(${JSON.stringify(importPath)});`;
    };

    let transformed = code.replace(importRegex, (match, prefix, imports, importPath) => {
      return `${prefix}${transformImportClause(imports, importPath)}`;
    });

    const exportNames = [];
    transformed = transformed.replace(/export\s+const\s+([A-Za-z0-9_$]+)\s*=/g, (_match, name) => {
      exportNames.push(name);
      return `const ${name} = `;
    });
    transformed = transformed.replace(/export\s+default\s+([A-Za-z0-9_$]+)/g, "module.exports.default = $1");
    transformed += "\n" + exportNames.map((name) => `module.exports[${JSON.stringify(name)}] = ${name};`).join("\n");

    const script = new vm.Script(transformed, { filename: normalized });
    const context = vm.createContext({ require: requireFn, module, exports: module.exports, console, process, __dirname: moduleDir, __filename: normalized });
    script.runInContext(context);

    moduleCache.set(normalized, module.exports);
    return module.exports;
  };

  const entry = loadModuleSync(entryFile);
  const productsArray = entry.products || entry.default || [];
  return Array.isArray(productsArray) ? productsArray : [];
};

const slugify = (value) => String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const normalizeFrontendProduct = (product) => {
  const name = product.name || product.title || product.productName || "Unnamed Product";
  const categoryName = product.productCategory || product.category || product.subCategory || "Uncategorized";
  const brandName = product.brand || product.manufacturer || "EZStore";

  const price = Number(product.price ?? product.variants?.[0]?.price ?? 0);
  const stock = Number(product.stock ?? 0);
  const imageUrl = product.imageUrl || product.image || (Array.isArray(product.images) ? product.images[0] : "") || "";
  const tags = Array.isArray(product.tags) ? product.tags : [];

  const normalized = {
    name,
    slug: slugify(product.slug || name),
    description: product.description || "",
    price,
    stock,
    status: product.status || "active",
    imageUrl,
    tags,
    metadata: {
      category: product.category,
      productCategory: product.productCategory,
      subCategory: product.subCategory,
      brand: product.brand,
      manufacturer: product.manufacturer,
      pet: product.pet,
      petType: product.petType,
      productType: product.productType,
      breedSize: product.breedSize,
      shopByBreed: product.shopByBreed,
      flavor: product.flavor,
      lifeStage: product.lifeStage,
      specialDiet: product.specialDiet,
      vegType: product.vegType,
      size: product.size,
      rating: product.rating,
      reviews: product.reviews,
      soldCount: product.soldCount,
      fastDelivery: product.fastDelivery,
      isNew: product.isNew,
      deliveryDate: product.deliveryDate,
      ingredients: product.ingredients,
      features: product.features,
      nutrition: product.nutrition,
      weight: product.weight,
      variants: product.variants,
      subscriptionEligible: product.subscriptionEligible,
      subscriptionDiscount: product.subscriptionDiscount,
      relatedProducts: product.relatedProducts,
    },
    categorySlug: slugify(categoryName),
    categoryName,
    brandSlug: slugify(brandName),
    brandName,
  };

  return normalized;
};

const adminCredentials = {
  email: process.env.ADMIN_EMAIL || "admin@ezstore.com",
  password: process.env.ADMIN_PASSWORD || "admin123",
};

const findOrCreateCategory = async (category) => {
  const existing = await prisma.category.findUnique({ where: { slug: category.slug } });
  if (existing) return existing;
  return prisma.category.create({ data: category });
};

const findOrCreateBrand = async (brand) => {
  const existing = await prisma.brand.findUnique({ where: { slug: brand.slug } });
  if (existing) return existing;
  return prisma.brand.create({ data: brand });
};

const findOrCreateProduct = async (product, categoryId, brandId) => {
  const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
  if (existing) return existing;
  return prisma.product.create({
    data: {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      stock: product.stock,
      status: product.status,
      imageUrl: product.imageUrl,
      tags: product.tags,
      metadata: product.metadata,
      categoryId,
      brandId,
    },
  });
};

const findOrCreateCustomer = async (customer) => {
  const normalizedEmail = String(customer.email).trim().toLowerCase();
  const existing = await prisma.customer.findUnique({ where: { email: normalizedEmail } });
  if (existing) return existing;

  const hashed = await bcrypt.hash(String(customer.password), 10);
  return prisma.customer.create({
    data: {
      email: normalizedEmail,
      password: hashed,
      firstName: customer.firstName,
      lastName: customer.lastName,
      fullName: `${customer.firstName} ${customer.lastName}`,
      phone: customer.phone,
      status: "active",
      emailVerified: customer.emailVerified ?? true,
      emailVerifiedAt: new Date(),
    },
  });
};

const findOrCreateOrder = async (orderData, customerId, productsMap) => {
  const existing = await prisma.order.findUnique({ where: { orderNumber: orderData.orderNumber } });
  if (existing) return existing;

  const itemsJson = orderData.items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    productSlug: item.productSlug,
  }));

  const order = await prisma.order.create({
    data: {
      orderNumber: orderData.orderNumber,
      status: orderData.status,
      totalAmount: orderData.totalAmount,
      items: itemsJson,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus,
      currency: orderData.currency,
      placedAt: orderData.orderDate,
      customerId,
      orderItems: {
        create: orderData.items.map((item) => ({
          productId: productsMap[item.productSlug]?.id || undefined,
          productName: item.name,
          productSku: productsMap[item.productSlug]?.sku || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
          metadata: { source: "seed" },
        })),
      },
    },
  });

  return order;
};

async function main() {
  console.log("Seeding initial EZStore data...");

  const adminEmail = adminCredentials.email.trim().toLowerCase();
  const adminExisting = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!adminExisting) {
    const hashedAdminPassword = await bcrypt.hash(adminCredentials.password, 10);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedAdminPassword,
        name: "EZStore Admin",
        role: "admin",
        status: "active",
      },
    });
    console.log(`Created admin: ${adminEmail}`);
  } else {
    console.log(`Admin already exists: ${adminEmail}`);
  }

  const categories = {};
  for (const category of sampleCategories) {
    categories[category.slug] = await findOrCreateCategory(category);
  }

  const brands = {};
  for (const brand of sampleBrands) {
    brands[brand.slug] = await findOrCreateBrand(brand);
  }

  const products = {};
  for (const product of sampleProducts) {
    const category = categories[product.categorySlug];
    const brand = brands[product.brandSlug];
    if (!category || !brand) continue;
    products[product.slug] = await findOrCreateProduct(product, category.id, brand.id);
  }

  const frontendProducts = await loadFrontendProducts();
  for (const product of frontendProducts) {
    const normalized = normalizeFrontendProduct(product);
    if (!normalized.slug) continue;

    const categorySlug = normalized.categorySlug || slugify(normalized.categoryName);
    const brandSlug = normalized.brandSlug || slugify(normalized.brandName);

    if (!categories[categorySlug]) {
      categories[categorySlug] = await findOrCreateCategory({
        name: normalized.categoryName,
        slug: categorySlug,
        description: `${normalized.categoryName} products`,
        status: "active",
      });
    }

    if (!brands[brandSlug]) {
      brands[brandSlug] = await findOrCreateBrand({
        name: normalized.brandName,
        slug: brandSlug,
        description: `${normalized.brandName} products`,
        status: "active",
      });
    }

    products[normalized.slug] = await findOrCreateProduct(normalized, categories[categorySlug].id, brands[brandSlug].id);
  }

  const customer = await findOrCreateCustomer(sampleCustomers[0]);

  const productsMap = sampleProducts.reduce((map, product) => ({ ...map, [product.slug]: products[product.slug] }), {});
  for (const orderData of sampleOrders) {
    await findOrCreateOrder(orderData, customer.id, productsMap);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
