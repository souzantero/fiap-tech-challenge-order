import { Customer } from '../../domain/entities/customer';
import { CustomerRepository } from '../../domain/repositories/customer-repository';

export class FindCustomer {
  constructor(private readonly customerRepository: CustomerRepository) {}

  findOneByDocument(document: string): Promise<Customer | null> {
    return this.customerRepository.findOneByDocument(document);
  }
}
