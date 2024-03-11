import { Hasher } from 'src/core/domain/protocols/hasher';
import { Logger } from 'src/core/domain/protocols/logger';
import { CustomerRepository } from '../../domain/repositories/customer-repository';
import { Authenticator } from '../../domain/protocols/authenticator';

export class AnonymizeCustomer {
  constructor(
    private readonly authenticator: Authenticator,
    private readonly customerRepository: CustomerRepository,
    private readonly hasher: Hasher,
    private readonly logger: Logger,
  ) {}

  async anonymize({
    name,
    email,
    document,
  }: AnonymizeCustomerParams): Promise<void> {
    const customer = await this.customerRepository.findOneByDocument(document);
    if (!customer) throw new CustomerNotFoundError();
    if (customer.name !== name)
      throw new AnonymizeCustomerError('Name does not match');
    if (customer.email !== email)
      throw new AnonymizeCustomerError('Email does not match');

    await this.authenticator.unregister(document);

    const anonymizedName = await this.hasher.hash(name);
    const anonymizedEmail = await this.hasher.hash(email);
    const anonymizedDocument = await this.hasher.hash(document);

    await this.customerRepository.updateOneById(customer.id, {
      name: anonymizedName,
      email: anonymizedEmail,
      document: anonymizedDocument,
    });

    this.logger.info(
      `Customer ${customer.id} with document ${document} anonymized`,
    );
  }
}

export type AnonymizeCustomerParams = {
  name: string;
  email: string;
  document: string;
};

export class CustomerNotFoundError extends Error {
  constructor() {
    super('Customer not found');
    this.name = 'CustomerNotFoundError';
  }
}

export class AnonymizeCustomerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnonymizeCustomerError';
  }
}
