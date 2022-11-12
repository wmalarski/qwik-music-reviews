import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

console.log("=====HELLO=====", typeof global);

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

export type DbPrismaClient = typeof prisma;

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
