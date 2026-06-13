import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed admin
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.admin.upsert({
    where: { email: "admin@chichiskitchen.com" },
    update: {},
    create: {
      email: "admin@chichiskitchen.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  // Seed menu items
  const menuItems = [
    {
      name: "Noodles",
      description:
        "Perfectly seasoned stir-fried noodles with assorted vegetables and your choice of protein. A campus favourite!",
      image: "/images/noodles.png",
      category: "Noodles",
      sizes: [
        { label: "Small", price: 30 },
        { label: "Medium", price: 40 },
        { label: "Large", price: 50 },
      ],
    },
    {
      name: "Assorted Jollof",
      description:
        "Rich, smoky jollof rice slow-cooked with a blend of tomatoes and spices, served with assorted meats.",
      image: "/images/jollof.png",
      category: "Jollof",
      sizes: [
        { label: "Regular", price: 40 },
        { label: "Large", price: 60 },
      ],
    },
    {
      name: "Assorted Fried Rice",
      description:
        "Flavourful fried rice loaded with assorted meats, vegetables, and a perfect seasoning blend.",
      image: "/images/fried-rice.png",
      category: "Fried Rice",
      sizes: [
        { label: "Regular", price: 40 },
        { label: "Large", price: 60 },
      ],
    },
  ];

  for (const item of menuItems) {
    const existing = await prisma.menuItem.findFirst({
      where: { name: item.name },
    });
    if (!existing) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          image: item.image,
          category: item.category,
          sizes: { create: item.sizes },
        },
      });
    }
  }

  console.log("✅ Database seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
