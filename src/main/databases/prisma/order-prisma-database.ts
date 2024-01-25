import {
  PrismaClient,
  Order as OrderPrismaEntity,
  OrderProduct as OrderProductPrismaEntity
} from '@prisma/client';
import {
  CreateOneOrderData,
  OrderRepository,
  UpdateOneOrderData,
} from '../../../core/domain/repositories/order-repository';
import {
  Order,
  OrderProduct,
  OrderStatus,
} from '../../../core/domain/entities/order';
import { PrismaDatabaseError } from './prisma-database';

export type OrderPrismaEntityWithRelations = OrderPrismaEntity & {
  orderProducts?: OrderProductPrismaEntity[];
};

export class OrderPrismaDatabase implements OrderRepository {
  constructor(private readonly prisma: PrismaClient) { }

  static toModel(order: OrderPrismaEntityWithRelations): Order {
    const status = Object.values(OrderStatus).find(
      (status) => status === order.status,
    );

    if (!status)
      throw new PrismaDatabaseError(`Invalid order status: ${order.status}`);

    return {
      id: order.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      deletedAt: order.deletedAt,
      customerId: order.customerId,
      status,
      paid: order.paid,
      products: order.orderProducts?.map(OrderProductPrismaDatabase.toModel),
    };
  }

  async createOne(data: CreateOneOrderData): Promise<Order> {
    const order = await this.prisma.order.create({
      data: {
        customerId: data.customerId,
        status: data.status,
        paid: data.paid,
        orderProducts: {
          create: data.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        },
      },
      include: {
        orderProducts: true
      },
    });

    return OrderPrismaDatabase.toModel(order);
  }

  async updateOneById(id: string, data: UpdateOneOrderData): Promise<Order> {
    const order = await this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status: data.status,
        paid: data.paid,
      },
    });

    return OrderPrismaDatabase.toModel(order);
  }

  async findNotFinished(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        status: {
          notIn: [OrderStatus.Finished],
        },
      },
      include: {
        orderProducts: true
      },
    });

    return orders.map(OrderPrismaDatabase.toModel);
  }

  async findOneById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        orderProducts: true
      },
    });

    if (!order) return null;

    return OrderPrismaDatabase.toModel(order);
  }
}

export class OrderProductPrismaDatabase {
  static toModel(order: OrderProductPrismaEntity): OrderProduct {
    return {
      id: order.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      deletedAt: order.deletedAt,
      orderId: order.orderId,
      productId: order.productId,
      quantity: order.quantity
    };
  }
}
