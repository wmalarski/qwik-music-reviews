import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const getPrisma = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

export const prisma =
  typeof global !== "undefined" ? global.prisma || getPrisma() : getPrisma();

export type DbPrismaClient = typeof prisma;

if (process.env.NODE_ENV !== "production" && typeof global !== "undefined") {
  global.prisma = prisma;
}
