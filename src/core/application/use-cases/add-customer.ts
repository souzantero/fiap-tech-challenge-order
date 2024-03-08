import { Authenticator } from 'src/core/domain/protocols/authenticator';
import { Customer } from '../../domain/entities/customer';
import { CustomerRepository } from '../../domain/repositories/customer-repository';

export class AddCustomer {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly authenticator: Authenticator,
  ) {}

  async addOne({
    name,
    email,
    document,
    password,
  }: AddOneCustomerData): Promise<Customer> {
    const customerByDocument = await this.customerRepository.findOneByDocument(
      document,
    );
    if (customerByDocument)
      throw new AddOneCustomerError('Customer already exists');

    const customerByEmail = await this.customerRepository.findOneByEmail(email);
    if (customerByEmail)
      throw new AddOneCustomerError('Customer already exists');

    const createdCustomer = await this.customerRepository.createOne({
      name,
      email,
      document,
    });

    await this.authenticator.singUp({
      username: document,
      password: password,
      email: email,
    });

    return createdCustomer;
  }
}

export class AddOneCustomerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AddOneCustomerError';
  }
}

export type AddOneCustomerData = {
  name: string;
  email: string;
  document: string;
  password: string;
};
