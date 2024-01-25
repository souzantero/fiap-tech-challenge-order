import { PrismaClient, Customer as CustomerPrismaEntity } from '@prisma/client';
import {
  CreateOneCustomerData,
  CustomerRepository,
} from '../../../core/domain/repositories/customer-repository';
import { Customer } from '../../../core/domain/entities/customer';

export class CustomerPrismaDatabase implements CustomerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  static toModel(customer: CustomerPrismaEntity): Customer {
    return {
      id: customer.id,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      deletedAt: customer.deletedAt,
      name: customer.name,
      email: customer.email,
      document: customer.document,
    };
  }

  async createOne(data: CreateOneCustomerData): Promise<Customer> {
    const customer = await this.prisma.customer.create({ data });
    return CustomerPrismaDatabase.toModel(customer);
  }

  async findOneById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    return customer ? CustomerPrismaDatabase.toModel(customer) : null;
  }

  async findOneByDocument(document: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { document },
    });
    return customer ? CustomerPrismaDatabase.toModel(customer) : null;
  }

  async findOneByEmail(email: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { email },
    });
    return customer ? CustomerPrismaDatabase.toModel(customer) : null;
  }
}
