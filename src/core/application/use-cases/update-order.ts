import { Order } from '../../domain/entities/order';
import {
  UpdateOneOrderData,
  UpdateOneOrderRepository,
} from '../../domain/repositories/order-repository';
import { FindOrders } from './find-orders';

export class UpdateOrder {
  constructor(
    private readonly orderRepository: UpdateOneOrderRepository,
    private readonly findOrders: FindOrders,
  ) {}

  async updateOneById(id: string, data: UpdateOneOrderData): Promise<Order> {
    await this.findOrders.findOneById(id);
    return this.orderRepository.updateOneById(id, data);
  }
}
