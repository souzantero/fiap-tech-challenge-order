import { OrderCancelledEvent } from '../../domain/events/order-cancelled-event';
import { Order, OrderStatus } from '../../domain/entities/order';
import { UpdateOrder } from './update-order';

export class CancelOrder {
  constructor(
    private readonly updateOrder: UpdateOrder,
    private readonly orderCancelledEvent: OrderCancelledEvent,
  ) {}

  async cancel(orderId: string): Promise<Order> {
    const updatedOrder = await this.updateOrder.updateOneById(orderId, {
      status: OrderStatus.Cancelled,
    });

    await this.orderCancelledEvent.onCancelled(updatedOrder);
    return updatedOrder;
  }
}
