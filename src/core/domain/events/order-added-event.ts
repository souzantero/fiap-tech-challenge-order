import { Order } from '../entities/order';

export interface OrderAddedEvent {
  onAdded(order: Order): Promise<void>;
}
