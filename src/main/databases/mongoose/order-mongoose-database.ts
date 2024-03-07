import mongoose, { Schema } from 'mongoose';
import { Order, OrderStatus } from '../../../core/domain/entities/order';
import {
  CreateOneOrderData,
  OrderRepository,
  UpdateOneOrderData,
} from '../../../core/domain/repositories/order-repository';

const OrderSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  customerId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  paid: {
    type: Boolean,
    required: true,
  },
  products: [
    {
      quantity: {
        type: Number,
        required: true,
      },
      productId: {
        type: String,
        required: true,
      },
    },
  ],
});

const OrderModel = mongoose.model('Order', OrderSchema);

const toEntity = (order: any): Order => ({
  id: order._id.toString(),
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  deletedAt: order.deletedAt,
  customerId: order.customerId,
  status: order.status,
  paid: order.paid,
  products: order.products.map((product: any) => ({
    id: order._id.toString(),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    orderId: order._id.toString(),
    quantity: product.quantity,
    productId: product.productId,
  })),
});

export class OrderMongooseDatabase implements OrderRepository {
  async createOne(data: CreateOneOrderData): Promise<Order> {
    const order = new OrderModel(data);
    await order.save();
    return toEntity(order);
  }

  async updateOneById(id: string, data: UpdateOneOrderData): Promise<Order> {
    await OrderModel.updateOne({ _id: id }, data);
    const order = await OrderModel.findById(id);
    return toEntity(order);
  }

  async findNotFinished(): Promise<Order[]> {
    const orders = await OrderModel.find({
      status: { $nin: [OrderStatus.Finished] },
      deletedAt: { $eq: null },
    });
    return orders.map(toEntity);
  }

  async findOneById(id: string): Promise<Order | null> {
    const order = await OrderModel.findOne({ _id: id, deletedAt: null });
    if (!order) {
      return null;
    }

    return toEntity(order);
  }
}
