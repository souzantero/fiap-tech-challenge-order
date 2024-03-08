import { Order } from '../entities/order';

export interface OrderCancelledEvent {
  onCancelled(order: Order): Promise<void>;
}
