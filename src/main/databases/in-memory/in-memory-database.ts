import { Repository } from '../../../core/domain/repositories/repository';
import { CustomerInMemoryDatabase } from './customer-in-memory-database';
import { OrderInMemoryDatabase } from './order-in-memory-database';
import { ProductInMemoryDatabase } from './product-in-memory-database';

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export class InMemoryDatabase implements Repository {
  public readonly customer = new CustomerInMemoryDatabase();
  public readonly product = new ProductInMemoryDatabase();
  public readonly order = new OrderInMemoryDatabase();
}
