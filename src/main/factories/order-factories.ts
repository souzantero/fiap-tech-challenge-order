import { UpdateOrder } from '../../core/application/use-cases';
import { AddOrder } from '../../core/application/use-cases/add-order';
import { FindOrders } from '../../core/application/use-cases/find-orders';
import { Repository } from '../../core/domain/repositories/repository';
import {
  AddOneOrderHttpController,
  CheckOrderIsPaidHttpController,
  FindOrdersHttpController,
  MercadoPagoWebhookHttpController,
  UpdateOrderStatusHttpController,
} from '../../core/presentation/controllers/order-http-controller';
import { CatchErrorHttpControllerDecorator } from '../../core/presentation/decorators/catch-error-http-controller-decorator';

export const makeFindOrdersHttpController = (repository: Repository) => {
  return new CatchErrorHttpControllerDecorator(
    new FindOrdersHttpController(new FindOrders(repository.order)),
  );
};

export const makeAddOneOrderHttpController = (repository: Repository) => {
  return new CatchErrorHttpControllerDecorator(
    new AddOneOrderHttpController(
      new AddOrder(repository.order, repository.customer, repository.product),
    ),
  );
};

export const makeUpdateOrderStatusHttpController = (repository: Repository) => {
  return new CatchErrorHttpControllerDecorator(
    new UpdateOrderStatusHttpController(
      new UpdateOrder(repository.order, new FindOrders(repository.order)),
    ),
  );
};

export const makeCheckOrderIsPaidHttpController = (repository: Repository) => {
  return new CatchErrorHttpControllerDecorator(
    new CheckOrderIsPaidHttpController(new FindOrders(repository.order)),
  );
};

export const makeMercadoPagoWebhookHttpController = (
  repository: Repository,
) => {
  return new CatchErrorHttpControllerDecorator(
    new MercadoPagoWebhookHttpController(
      new UpdateOrder(repository.order, new FindOrders(repository.order)),
    ),
  );
};
