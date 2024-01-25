import { CustomerRepository } from './customer-repository';
import { OrderRepository } from './order-repository';
import { ProductRepository } from './product-repository';

export interface Repository {
  customer: CustomerRepository;
  product: ProductRepository;
  order: OrderRepository;
}
