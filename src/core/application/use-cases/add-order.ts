import { Order, OrderStatus } from '../../domain/entities/order';
import { FindOneCustomerRepository } from '../../domain/repositories/customer-repository';
import {
  CreateOneOrderData,
  OrderRepository,
} from '../../domain/repositories/order-repository';
import { FindManyProductsRepository } from '../../domain/repositories/product-repository';

export class AddOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly findOneCustomer: FindOneCustomerRepository,
    private readonly findManyProducts: FindManyProductsRepository,
  ) {}

  async addOne(data: AddOneOrderData): Promise<Order> {
    const customerById = await this.findOneCustomer.findOneById(
      data.customerId,
    );
    if (!customerById) throw new CustomerNotFoundError();
    const productIds = data.products.map((product) => product.productId);
    const productsByIds = await this.findManyProducts.findManyByIds(productIds);
    if (productsByIds.length !== productIds.length) {
      const productIdsNotFound = productIds.filter((productId) =>
        productsByIds.every((product) => product.id !== productId),
      );

      throw new ProductsNotFoundError(productIdsNotFound);
    }

    const order = {
      ...data,
      status: OrderStatus.Received,
      paid: false,
    };

    return this.orderRepository.createOne(order);
  }
}

export class CustomerNotFoundError extends Error {
  constructor() {
    super('Customer not found');
    this.name = 'CustomerNotFoundError';
  }
}

export class ProductsNotFoundError extends Error {
  constructor(productIds: string[]) {
    super(`Products not found: ${productIds.join(', ')}`);
    this.name = 'ProductNotFoundError';
  }
}

export type AddOneOrderData = Omit<CreateOneOrderData, 'status' | 'paid'>;
