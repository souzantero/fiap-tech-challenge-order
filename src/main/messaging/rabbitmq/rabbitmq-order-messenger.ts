import { Channel } from 'amqplib';
import { Order } from 'src/core/domain/entities/order';
import { OrderAddedEvent } from 'src/core/domain/events/order-added-event';

export class RabbitMQOrderMessenger implements OrderAddedEvent {
  constructor(private readonly channel: Channel) {}

  async onAdded(order: Order): Promise<void> {
    this.channel.sendToQueue('order.added', Buffer.from(JSON.stringify(order)));
  }
}
