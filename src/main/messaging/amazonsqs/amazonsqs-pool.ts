import { SQSHandler } from 'aws-lambda';
import { SQS } from 'aws-sdk';

export class AmazonSQSPool {
  constructor(private readonly sqs: SQS, private readonly queueUrl: string) {}

  async receive(handler: SQSHandler): Promise<void> {
    const receiveParams = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    };

    console.log('Receiving messages...');
    const data = await this.sqs.receiveMessage(receiveParams).promise();
    console.log('Received messages:', data.Messages?.length);
    if (!data.Messages) {
      return;
    }

    for (const message of data.Messages) {
      const record = {
        body: message.Body as string,
      };

      const event = {
        Records: [record],
      } as any;

      const context = {} as any;
      const callback = null as any;

      await handler(event, context, callback);

      const deleteParams = {
        QueueUrl: this.queueUrl,
        ReceiptHandle: message.ReceiptHandle as string,
      };

      await this.sqs.deleteMessage(deleteParams).promise();
    }
  }
}
