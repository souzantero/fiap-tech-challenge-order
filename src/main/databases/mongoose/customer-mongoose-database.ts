import mongoose, { Schema } from 'mongoose';
import { Customer } from '../../../core/domain/entities/customer';
import {
  CreateOneCustomerData,
  CustomerRepository,
} from '../../../core/domain/repositories/customer-repository';

const CustomerSchema = new Schema({
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
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  document: {
    type: String,
    required: true,
  },
});

export const CustomerModel = mongoose.model('Customer', CustomerSchema);

export const toEntity = (customer: any): Customer => ({
  id: customer._id.toString(),
  createdAt: customer.createdAt,
  updatedAt: customer.updatedAt,
  deletedAt: customer.deletedAt,
  name: customer.name,
  email: customer.email,
  document: customer.document,
});

export class CustomerMongooseDatabase implements CustomerRepository {
  async createOne(data: CreateOneCustomerData): Promise<Customer> {
    const customer = new CustomerModel(data);
    await customer.save();
    return toEntity(customer);
  }

  async findOneById(id: string): Promise<Customer | null> {
    const customer = await CustomerModel.findOne({ _id: id, deletedAt: null });
    if (!customer) {
      return null;
    }

    return toEntity(customer);
  }

  async findOneByDocument(document: string): Promise<Customer | null> {
    const customer = await CustomerModel.findOne({ document, deletedAt: null });
    if (!customer) {
      return null;
    }

    return toEntity(customer);
  }

  async findOneByEmail(email: string): Promise<Customer | null> {
    const customer = await CustomerModel.findOne({ email, deletedAt: null });
    if (!customer) {
      return null;
    }

    return toEntity(customer);
  }
}
