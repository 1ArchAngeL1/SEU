import { PrismaClient } from '@prisma/client';

// Extend the global object type to include a `prisma` property.
// This lets us store the client instance globally so it survives
// Next.js hot reloads in development (which re-execute module code).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Reuse the existing global instance if it exists, otherwise create a new one.
// The `??` (nullish coalescing) operator picks the right side only if the left is null/undefined.
const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In development, save the client to the global object so the NEXT hot reload
// reuses it instead of creating a new connection each time.
// In production, this is skipped — the module runs once and the single instance is fine.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
