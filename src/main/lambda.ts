import serverless from 'serverless-http';
import { Repository } from '../core/domain/repositories/repository';
import { App } from './app';
import { environment } from './configuration/environment';
import { PrismaDatabase } from './databases/prisma/prisma-database';
import { ProductFetchProvider } from './providers/fetch/product-fetch-provider';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { makeAcceptOrder, makeCancelOrder } from './factories/order-factories';

const prismaDatabase = new PrismaDatabase();
const productProvider = new ProductFetchProvider(environment.productUrl);
const repository: Repository = {
  customer: prismaDatabase.customer,
  order: prismaDatabase.order,
  product: productProvider,
};

const app = App.create(repository);

export const handler = serverless(app.express);

export const onPaymentApproved: SQSHandler = async (event: SQSEvent) => {
  try {
    const payment = JSON.parse(event.Records[0].body);
    const acceptOrder = makeAcceptOrder(repository);
    const acceptedOrder = await acceptOrder.accept(payment.orderId);
    console.log('Order accepted:', JSON.stringify(acceptedOrder));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const onPaymentRejected: SQSHandler = async (event: SQSEvent) => {
  try {
    const payment = JSON.parse(event.Records[0].body);
    const cancelOrder = makeCancelOrder(repository);
    const cancelledOrder = await cancelOrder.cancel(payment.orderId);
    console.log('Order cancelled', JSON.stringify(cancelledOrder));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
