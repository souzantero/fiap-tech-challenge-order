import { Customer } from '../entities/customer';

export type CreateOneCustomerData = Omit<
  Customer,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export interface CreateOneCustomerRepository {
  createOne(data: CreateOneCustomerData): Promise<Customer>;
}

export interface FindOneCustomerRepository {
  findOneById(id: string): Promise<Customer | null>;
  findOneByDocument(document: string): Promise<Customer | null>;
  findOneByEmail(email: string): Promise<Customer | null>;
}

export type CustomerRepository = CreateOneCustomerRepository &
  FindOneCustomerRepository;
