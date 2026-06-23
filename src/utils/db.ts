import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const databaseUrl = process.env.DATABASE_URL || '';

let prismaInstance: PrismaClient;

if (databaseUrl.startsWith('prisma+postgres://')) {
  // Prisma Postgres / Accelerate
  prismaInstance = new PrismaClient({
    accelerateUrl: databaseUrl,
  });
} else {
  // Direct connection (MySQL/MariaDB) using driver adapter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let config: Record<string, any> = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'porto_db',
    connectionLimit: 10,
    allowPublicKeyRetrieval: true,
  };

  if (databaseUrl.startsWith('mysql://')) {
    try {
      const url = new URL(databaseUrl);
      config = {
        host: url.hostname || 'localhost',
        port: url.port ? parseInt(url.port) : 3306,
        user: url.username || 'root',
        password: decodeURIComponent(url.password || ''),
        database: url.pathname.replace(/^\//, '') || 'porto_db',
        connectionLimit: 10,
        allowPublicKeyRetrieval: true,
      };
    } catch (e) {
      console.error('Failed to parse MySQL DATABASE_URL:', e);
    }
  }

  const adapter = new PrismaMariaDb(config);
  prismaInstance = new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || prismaInstance;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
