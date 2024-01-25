import { Repository } from '../../core/domain/repositories/repository';
import { AddCustomer } from '../../core/application/use-cases/add-customer';
import { FindCustomer } from '../../core/application/use-cases/find-customer';
import {
  AddOneCustomerHttpController,
  FindOneCustomerHttpController,
} from '../../core/presentation/controllers/customer-http-controller';
import { CatchErrorHttpControllerDecorator } from '../../core/presentation/decorators/catch-error-http-controller-decorator';

export const makeFindOneCustomerHttpController = (repository: Repository) => {
  return new CatchErrorHttpControllerDecorator(
    new FindOneCustomerHttpController(new FindCustomer(repository.customer)),
  );
};

export const makeAddOneCustomerHttpController = (repository: Repository) => {
  return new CatchErrorHttpControllerDecorator(
    new AddOneCustomerHttpController(new AddCustomer(repository.customer)),
  );
};
