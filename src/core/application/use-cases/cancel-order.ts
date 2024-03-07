import { Order, OrderStatus } from '../../domain/entities/order';
import { UpdateOrder } from './update-order';

export class CancelOrder {
  constructor(private readonly updateOrder: UpdateOrder) {}

  async cancel(orderId: string): Promise<Order> {
    return this.updateOrder.updateOneById(orderId, {
      status: OrderStatus.Cancelled,
    });
  }
}
