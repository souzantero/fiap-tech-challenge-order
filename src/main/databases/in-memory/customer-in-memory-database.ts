import { Customer } from '../../../core/domain/entities/customer';
import {
  CreateOneCustomerData,
  CreateOneCustomerRepository,
  FindOneCustomerRepository,
} from '../../../core/domain/repositories/customer-repository';
import { generateId } from './in-memory-database';

export class CustomerInMemoryDatabase
  implements CreateOneCustomerRepository, FindOneCustomerRepository
{
  private readonly customers: Customer[] = [];

  async createOne(data: CreateOneCustomerData): Promise<Customer> {
    const now = new Date();
    const customer = {
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      name: data.name,
      email: data.email,
      document: data.document,
    };

    this.customers.push(customer);

    return customer;
  }

  async findOneById(id: string): Promise<Customer | null> {
    const customer = this.customers.find((customer) => customer.id === id);
    return customer || null;
  }

  async findOneByDocument(document: string): Promise<Customer | null> {
    const customer = this.customers.find(
      (customer) => customer.document === document,
    );
    return customer || null;
  }

  async findOneByEmail(email: string): Promise<Customer | null> {
    const customer = this.customers.find(
      (customer) => customer.email === email,
    );
    return customer || null;
  }
}
