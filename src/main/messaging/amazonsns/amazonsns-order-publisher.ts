import { SNS } from 'aws-sdk';
import { Order } from 'src/core/domain/entities/order';
import { OrderAcceptedEvent } from '../../../core/domain/events/order-accepted-event';
import { OrderCancelledEvent } from '../../../core/domain/events/order-cancelled-event';

export type TopicArnByEvent = {
  [key in keyof (OrderAcceptedEvent & OrderCancelledEvent)]: string;
};

export class AmazonSNSOrderPublisher
  implements OrderAcceptedEvent, OrderCancelledEvent
{
  constructor(
    private readonly sns: SNS,
    private readonly topicArnByEvent: TopicArnByEvent,
  ) {}

  async onAccepted(order: Order): Promise<void> {
    await this.sns
      .publish({
        Message: JSON.stringify(order),
        TopicArn: this.topicArnByEvent.onAccepted,
      })
      .promise();
  }

  async onCancelled(order: Order): Promise<void> {
    await this.sns
      .publish({
        Message: JSON.stringify(order),
        TopicArn: this.topicArnByEvent.onCancelled,
      })
      .promise();
  }
}
