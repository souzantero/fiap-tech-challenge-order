import { FindCustomer } from '../../../core/application/use-cases';
import { Repository } from '../../../core/domain/repositories/repository';
import { AuthenticateHttpMiddleware } from '../../../core/presentation/middlewares/authenticate-http-middleware';
import { makeAuthentication } from '../customer-factories';

export const makeAuthenticateHttpMiddleware = (
  repository: Repository,
): AuthenticateHttpMiddleware => {
  const authorizer = makeAuthentication();
  const findCustomer = new FindCustomer(repository.customer);
  return new AuthenticateHttpMiddleware(authorizer, findCustomer);
};
