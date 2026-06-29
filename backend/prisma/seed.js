import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@ezstore.com";
  const rawPassword = process.env.ADMIN_PASSWORD || "admin123";

  const hashed = await bcrypt.hash(rawPassword, 10);

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists, skipping seed.");
    return;
  }

  const admin = await prisma.admin.create({ data: { email, password: hashed, name: "EZStore Admin", role: "admin" } });
  console.log("Created admin:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
