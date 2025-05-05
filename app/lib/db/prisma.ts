import { PrismaClient } from '@prisma/client';

// PrismaClient est attaché à la variable `global` en développement pour éviter
// d'épuiser les connexions de base de données pendant le hot-reloading
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 