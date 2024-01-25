import { Product } from '../entities/product';

export interface FindManyProductsRepository {
  findManyByIds(ids: string[]): Promise<Product[]>;
}

export type ProductRepository = FindManyProductsRepository;
