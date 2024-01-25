import { Product } from './product';

export type Order = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  customerId: string;
  status: OrderStatus;
  paid: boolean;

  products?: OrderProduct[];
};

export type OrderProduct = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  quantity: number;
  orderId: string;

  productId: string;
  product?: Product;
};

export enum OrderStatus {
  Received = 'RECEIVED',
  Preparing = 'PREPARING',
  Ready = 'READY',
  Finished = 'FINISHED',
}
