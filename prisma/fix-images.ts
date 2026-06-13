import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.menuItem.updateMany({
    where: { name: "Noodles" },
    data: { image: "/images/noodles.png" },
  });

  await prisma.menuItem.updateMany({
    where: { name: "Assorted Jollof" },
    data: { image: "/images/jollof.png" },
  });

  await prisma.menuItem.updateMany({
    where: { name: "Assorted Fried Rice" },
    data: { image: "/images/fried-rice.png" },
  });

  console.log("✅ Images updated successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());