import { OrderAcceptedEvent } from '../../domain/events/order-accepted-event';
import { Order, OrderStatus } from '../../domain/entities/order';
import { UpdateOrder } from './update-order';

export class AcceptOrder {
  constructor(
    private readonly updateOrder: UpdateOrder,
    private readonly orderAcceptedEvent: OrderAcceptedEvent,
  ) {}

  async accept(orderId: string): Promise<Order> {
    const updatedOrder = await this.updateOrder.updateOneById(orderId, {
      paid: true,
      status: OrderStatus.Received,
    });

    await this.orderAcceptedEvent.onAccepted(updatedOrder);
    return updatedOrder;
  }
}
