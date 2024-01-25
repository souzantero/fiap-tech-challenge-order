import { PrismaClient } from '@prisma/client';
import { CustomerPrismaDatabase } from './customer-prisma-database';
import { OrderPrismaDatabase } from './order-prisma-database';
import { Repository } from '../../../core/domain/repositories/repository';

export class PrismaDatabaseError extends Error {
  constructor(message: string) {
    super(`[PrismaDatabase]: ${message}`);
    this.name = 'PrismaDatabaseError';
  }
}

export class PrismaDatabase implements Omit<Repository, 'product'> {
  private readonly prisma: PrismaClient = new PrismaClient();

  public readonly customer = new CustomerPrismaDatabase(this.prisma);
  public readonly order = new OrderPrismaDatabase(this.prisma);

  connect(): Promise<void> {
    return this.prisma.$connect();
  }

  disconnect(): Promise<void> {
    return this.prisma.$disconnect();
  }

  async drop(): Promise<void> {
    await Promise.all([
      this.prisma.customer.deleteMany(),
      this.prisma.order.deleteMany(),
    ]);
  }
}
