import { Repository } from '../../core/domain/repositories/repository';
import { AddCustomer } from '../../core/application/use-cases/add-customer';
import { FindCustomer } from '../../core/application/use-cases/find-customer';
import { AnonymizeCustomer } from '../../core/application/use-cases/anonymize-customer';
import {
  AddOneCustomerHttpController,
  AnonymizeCustomerHttpController,
  FindOneCustomerHttpController,
} from '../../core/presentation/controllers/customer-http-controller';
import { CatchErrorHttpControllerDecorator } from '../../core/presentation/decorators/catch-error-http-controller-decorator';
import { AuthenticationFetchProvider } from '../providers/fetch/authentication-fetch-provider';
import { environment } from '../configuration/environment';
import { BcryptAdapter } from '../adapters/bcrypt-adapter';
import { ConsoleAdapter } from '../adapters/console-adapter';

export const makeAuthentication = () => {
  return new AuthenticationFetchProvider(environment.authenticationUrl);
};

export const makeFindOneCustomerHttpController = (repository: Repository) => {
  return new CatchErrorHttpControllerDecorator(
    new FindOneCustomerHttpController(new FindCustomer(repository.customer)),
  );
};

export const makeAddOneCustomerHttpController = (repository: Repository) => {
  return new CatchErrorHttpControllerDecorator(
    new AddOneCustomerHttpController(
      new AddCustomer(repository.customer, makeAuthentication()),
    ),
  );
};

export const makeAnonymizeCustomerHttpController = (repository: Repository) => {
  const auth = makeAuthentication();
  const hasher = new BcryptAdapter(12);
  const logger = new ConsoleAdapter();
  return new CatchErrorHttpControllerDecorator(
    new AnonymizeCustomerHttpController(
      new AnonymizeCustomer(auth, repository.customer, hasher, logger),
    ),
  );
};
