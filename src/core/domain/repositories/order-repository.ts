import { Order, OrderStatus } from '../entities/order';

export type CreateOneOrderData = {
  customerId: string;
  status: OrderStatus;
  paid: boolean;
  products: {
    productId: string;
    quantity: number;
  }[];
};

export type UpdateOneOrderData = {
  status?: OrderStatus;
  paid?: boolean;
};

export interface CreateOneOrderRepository {
  createOne(data: CreateOneOrderData): Promise<Order>;
}

export interface UpdateOneOrderRepository {
  updateOneById(id: string, data: UpdateOneOrderData): Promise<Order>;
}

export interface FindOrdersRepository {
  findNotFinished(): Promise<Order[]>;
}

export interface FindOneOrderRepository {
  findOneById(id: string): Promise<Order | null>;
}

export type OrderRepository = CreateOneOrderRepository &
  UpdateOneOrderRepository &
  FindOrdersRepository &
  FindOneOrderRepository;
