import serverless from 'serverless-http';
import { Repository } from '../core/domain/repositories/repository';
import { App } from './app';
import { environment } from './configuration/environment';
import { PrismaDatabase } from './databases/prisma/prisma-database';
import { ProductFetchProvider } from './providers/fetch/product-fetch-provider';

const prismaDatabase = new PrismaDatabase();
const productProvider = new ProductFetchProvider(environment.productUrl);
const repository: Repository = {
  customer: prismaDatabase.customer,
  order: prismaDatabase.order,
  product: productProvider,
};

const app = App.create(repository);

export const handler = serverless(app.express);
