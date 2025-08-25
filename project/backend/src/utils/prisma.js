import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

process.on("beforeExit", async () => {
  if (prisma && prisma.$disconnect) {
    await prisma.$disconnect();
  }
});

export { prisma };
