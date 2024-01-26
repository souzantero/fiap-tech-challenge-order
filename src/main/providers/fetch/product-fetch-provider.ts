import { Product } from '../../../core/domain/entities/product';
import { ProductRepository } from '../../../core/domain/repositories/product-repository';

export class ProductFetchProvider implements ProductRepository {
  constructor(private readonly url: string) {}

  async findManyByIds(ids: string[]): Promise<Product[]> {
    const response = await fetch(`${this.url}/products?ids=${ids.join(',')}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  }
}
