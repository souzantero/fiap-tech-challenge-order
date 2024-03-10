import { Customer } from '../../domain/entities/customer';
import { Authorizer } from '../../domain/protocols/authorizer';
import { FindCustomer } from '../../application/use-cases';
import {
  ForbiddenError,
  HttpMiddleware,
  HttpRequest,
  HttpResponse,
} from '../protocols/http';

export class AuthenticateHttpMiddleware implements HttpMiddleware<Customer> {
  constructor(
    private readonly authorizer: Authorizer,
    private readonly findCustomer: FindCustomer,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse<Customer>> {
    const { accessToken } = request;
    if (!accessToken) {
      throw new ForbiddenError('Missing authorization');
    }

    try {
      const username = await this.authorizer.authorize(accessToken);
      const customer = await this.findCustomer.findOneByDocument(username);
      if (!customer) {
        throw new ForbiddenError('Customer not found');
      }

      return HttpResponse.ok(customer);
    } catch (error) {
      throw new ForbiddenError((error as Error).message);
    }
  }
}
