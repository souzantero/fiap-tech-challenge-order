import mongoose from 'mongoose';
import serverless from 'serverless-http';
import { Repository } from '../core/domain/repositories/repository';
import { App } from './app';
import { environment } from './configuration/environment';
import { ProductFetchProvider } from './providers/fetch/product-fetch-provider';
import {
  APIGatewayProxyEvent,
  Context,
  SQSEvent,
  SQSHandler,
} from 'aws-lambda';
import { makeAcceptOrder, makeCancelOrder } from './factories/order-factories';
import { CustomerMongooseDatabase } from './databases/mongoose/customer-mongoose-database';
import { OrderMongooseDatabase } from './databases/mongoose/order-mongoose-database';

const connectMongoose = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(environment.databaseUrl);
  }
};

const createRepository = (): Repository => ({
  customer: new CustomerMongooseDatabase(),
  order: new OrderMongooseDatabase(),
  product: new ProductFetchProvider(environment.productUrl),
});

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  await connectMongoose();
  const repository = createRepository();
  const app = App.create(repository);
  return serverless(app.express)(event, context);
};

export const onPaymentApproved: SQSHandler = async (event: SQSEvent) => {
  try {
    await connectMongoose();
    const repository = createRepository();
    const acceptOrder = makeAcceptOrder(repository);
    const payment = JSON.parse(event.Records[0].body);
    const acceptedOrder = await acceptOrder.accept(payment.orderId);
    console.log('Order accepted:', JSON.stringify(acceptedOrder));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const onPaymentRejected: SQSHandler = async (event: SQSEvent) => {
  try {
    await connectMongoose();
    const repository = createRepository();
    const cancelOrder = makeCancelOrder(repository);
    const payment = JSON.parse(event.Records[0].body);
    const cancelledOrder = await cancelOrder.cancel(payment.orderId);
    console.log('Order cancelled', JSON.stringify(cancelledOrder));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
