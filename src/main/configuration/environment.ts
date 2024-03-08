export type EnvironmentName = 'development' | 'production';

export interface Environment {
  readonly name: EnvironmentName;
  readonly port: number;
  readonly databaseUrl: string;
  readonly authenticationUrl: string;
  readonly productUrl: string;
  readonly amqpUrl: string;
  readonly orderAddedSQSQueueUrl: string;
  readonly paymentApprovedSQSQueueUrl: string;
  readonly paymentRejectedSQSQueueUrl: string;
  readonly orderAcceptedSNSTopicArn: string;
  readonly orderCancelledSNSTopicArn: string;
}

if (process.env.NODE_ENV) {
  if (
    process.env.NODE_ENV !== 'development' &&
    process.env.NODE_ENV !== 'production'
  ) {
    throw new Error('NODE_ENV must be "development" or "production"');
  }
}

if (process.env.PORT) {
  const port = Number(process.env.PORT);
  if (Number.isNaN(port)) {
    throw new Error('PORT must be a number');
  }
}

export const environment: Environment = {
  name: (process.env.NODE_ENV as EnvironmentName) ?? 'development',
  port: Number(process.env.PORT) ?? 3001,
  databaseUrl:
    process.env.DATABASE_URL ??
    'mongodb://root:mongopass@localhost:27017/orderdb?authSource=admin',
  authenticationUrl:
    process.env.AUTHENTICATION_URL ?? 'http://localhost:3004/api',
  productUrl: process.env.PRODUCT_URL ?? 'http://localhost:3000/api',
  amqpUrl: process.env.AMQP_URL ?? 'amqp://localhost',
  orderAddedSQSQueueUrl: process.env.AWS_SQS_ORDER_ADDED_QUEUE_URL ?? '',
  paymentApprovedSQSQueueUrl:
    process.env.AWS_SQS_PAYMENT_APPROVED_QUEUE_URL ?? '',
  paymentRejectedSQSQueueUrl:
    process.env.AWS_SQS_PAYMENT_REJECTED_QUEUE_URL ?? '',
  orderAcceptedSNSTopicArn: process.env.AWS_SNS_ORDER_ACCEPTED_TOPIC_ARN ?? '',
  orderCancelledSNSTopicArn:
    process.env.AWS_SNS_ORDER_CANCELLED_TOPIC_ARN ?? '',
};
