import { Order, OrderStatus } from '../../domain/entities/order';
import { OrderRepository } from '../../domain/repositories/order-repository';

export class FindOrders {
  constructor(private readonly orderRepository: OrderRepository) {}

  async findOneById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOneById(id);
    if (!order) throw new FindOneOrderByIdError(`Order not found: ${id}`);
    return order;
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepository.findNotFinished();
    return this.sortOrdersByStatus(orders);
  }

  private sortOrdersByStatus(orders: Order[]): Order[] {
    return orders.sort((a, b) => {
      const aStatusOrder = this.getStatusOrder(a.status);
      const bStatusOrder = this.getStatusOrder(b.status);

      if (aStatusOrder < bStatusOrder) return -1;
      if (aStatusOrder > bStatusOrder) return 1;
      return 0;
    });
  }

  private getStatusOrder(status: OrderStatus): number {
    switch (status) {
      case OrderStatus.Ready:
        return 1;
      case OrderStatus.Preparing:
        return 2;
      case OrderStatus.Received:
        return 3;
      default:
        throw new Error(`Invalid order status: ${status}`);
    }
  }
}

export class FindOneOrderByIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FindOneOrderByIdError';
  }
}
