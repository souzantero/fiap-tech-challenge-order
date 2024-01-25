import { Product } from '../../../core/domain/entities/product';
import {
  FindManyProductsRepository
} from '../../../core/domain/repositories/product-repository';

export class ProductInMemoryDatabase
  implements
  FindManyProductsRepository {
  private readonly products: Product[] = [];

  async findManyByIds(ids: string[]): Promise<Product[]> {
    return this.products.filter((product) => ids.includes(product.id));
  }
}
