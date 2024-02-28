import { SQS } from 'aws-sdk';
import { Order } from 'src/core/domain/entities/order';
import { OrderAddedEvent } from 'src/core/domain/events/order-added-event';

export class AmazonSQSOrderMessenger implements OrderAddedEvent {
  constructor(private readonly sqs: SQS, private readonly queueUrl: string) {}

  async onAdded(order: Order): Promise<void> {
    const params: SQS.SendMessageRequest = {
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(order),
    };

    await this.sqs.sendMessage(params).promise();
  }
}
