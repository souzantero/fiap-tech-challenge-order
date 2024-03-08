import { Order } from '../entities/order';

export interface OrderAcceptedEvent {
  onAccepted(order: Order): Promise<void>;
}
