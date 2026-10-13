import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client 单例。
 * 避免开发热重载时重复创建连接。
 */
export const prisma = new PrismaClient();
