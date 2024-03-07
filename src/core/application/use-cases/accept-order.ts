import { Order } from '../../domain/entities/order';
import { UpdateOrder } from './update-order';

export class AcceptOrder {
  constructor(private readonly updateOrder: UpdateOrder) {}

  async accept(orderId: string): Promise<Order> {
    return this.updateOrder.updateOneById(orderId, { paid: true });
  }
}
