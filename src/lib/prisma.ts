import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton — prevents exhausting DB connections from hot-reload
 * creating a new client on every file change in dev.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
