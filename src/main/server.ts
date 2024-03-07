import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { Repository } from '../core/domain/repositories/repository';
import { App } from './app';
import { environment } from './configuration/environment';
import { PrismaDatabase } from './databases/prisma/prisma-database';
import { ProductFetchProvider } from './providers/fetch/product-fetch-provider';
import { pool } from './pool';
import { CustomerMongooseDatabase } from './databases/mongoose/customer-mongoose-database';
import { OrderMongooseDatabase } from './databases/mongoose/order-mongoose-database';

mongoose.connect(environment.databaseUrl).then(() => {
  const repository: Repository = {
    customer: new CustomerMongooseDatabase(),
    order: new OrderMongooseDatabase(),
    product: new ProductFetchProvider(environment.productUrl),
  };

  const app = App.create(repository);
  app.start(environment.port);
});

pool();
