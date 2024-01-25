import { Order } from '../../../core/domain/entities/order';
import {
  CreateOneOrderData,
  OrderRepository,
  UpdateOneOrderData,
} from '../../../core/domain/repositories/order-repository';
import { generateId } from './in-memory-database';

export class OrderInMemoryDatabase implements OrderRepository {
  private readonly orders: Order[] = [];

  createOne(data: CreateOneOrderData): Promise<Order> {
    const now = new Date();
    const orderId = generateId();
    const order: Order = {
      id: orderId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      customerId: data.customerId,
      paid: false,
      status: data.status,
      products: data.products.map((product) => ({
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        orderId: orderId,
        productId: product.productId,
        quantity: product.quantity,
      })),
    };

    this.orders.push(order);

    return Promise.resolve(order);
  }

  updateOneById(id: string, data: UpdateOneOrderData): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  
  findOneById(id: string): Promise<Order | null> {
    throw new Error('Method not implemented.');
  }

  findNotFinished(): Promise<Order[]> {
    return Promise.resolve(
      this.orders.filter((order) => order.status !== 'FINISHED'),
    );
  }
}
