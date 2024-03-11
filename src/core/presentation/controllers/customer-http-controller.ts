import { Customer } from '../../domain/entities/customer';
import {
  AddOneCustomerError,
  AddCustomer,
  FindCustomer,
  CustomerNotFoundError,
} from '../../application/use-cases';
import {
  AnonymizeCustomer,
  AnonymizeCustomerError,
} from '../../application/use-cases/anonymize-customer';
import {
  BadRequestError,
  HttpController,
  HttpRequest,
  HttpResponse,
  NotFoundError,
} from '../protocols/http';

export class AddOneCustomerHttpController implements HttpController<Customer> {
  constructor(private readonly addCustomer: AddCustomer) {}

  async handle(request: HttpRequest): Promise<HttpResponse<Customer>> {
    const { name, email, document, password } = request.body;
    if (!name || !email || !document || !password)
      throw new BadRequestError('Missing required fields');
    try {
      const customer = await this.addCustomer.addOne({
        name,
        email,
        document,
        password,
      });

      return HttpResponse.created(customer);
    } catch (error) {
      if (error instanceof AddOneCustomerError)
        throw new BadRequestError(error.message);
      throw error;
    }
  }
}

export class FindOneCustomerHttpController implements HttpController<Customer> {
  constructor(private readonly findCustomer: FindCustomer) {}
  async handle(request: HttpRequest): Promise<HttpResponse<Customer>> {
    const { document } = request.params;
    const customer = await this.findCustomer.findOneByDocument(document);
    if (!customer) throw new NotFoundError('Customer not found');
    return HttpResponse.ok(customer);
  }
}

export class AnonymizeCustomerHttpController implements HttpController<void> {
  constructor(private readonly anonymizeCustomer: AnonymizeCustomer) {}
  async handle(request: HttpRequest): Promise<HttpResponse<void>> {
    const { name, email, document } = request.body;
    if (!name || !email || !document) {
      throw new BadRequestError('Missing required fields');
    }

    try {
      await this.anonymizeCustomer.anonymize({ name, document, email });
      return HttpResponse.noContent();
    } catch (error) {
      if (error instanceof AnonymizeCustomerError) {
        throw new BadRequestError(error.message);
      } else if (error instanceof CustomerNotFoundError) {
        throw new NotFoundError(error.message);
      }

      throw error;
    }
  }
}
