import {
  AcceptOrder,
  CancelOrder,
  UpdateOrder,
} from '../../core/application/use-cases';
import { AddOrder } from '../../core/application/use-cases/add-order';
import { FindOrders } from '../../core/application/use-cases/find-orders';
import { Repository } from '../../core/domain/repositories/repository';
import {
  AddOneOrderHttpController,
  CheckOrderIsPaidHttpController,
  FindOrdersHttpController,
  PayOrderHttpController,
  UpdateOrderStatusHttpController,
} from '../../core/presentation/controllers/order-http-controller';
import { CatchErrorHttpControllerDecorator } from '../../core/presentation/decorators/catch-error-http-controller-decorator';
import { environment } from '../configuration/environment';
import {
  AmazonSNSOrderPublisher,
  TopicArnByEvent,
} from '../messaging/amazonsns/amazonsns-order-publisher';
import { AmazonSNSService } from '../messaging/amazonsns/amazonsns-service';
import { AmazonSQSOrderMessenger } from '../messaging/amazonsqs/amazonsqs-order-messenger';
import { AmazonSQSService } from '../messaging/amazonsqs/amazonsqs-service';

export const makeFindOrders = (repository: Repository) => {
  return new FindOrders(repository.order);
};

export const makeUpdateOrder = (repository: Repository) => {
  return new UpdateOrder(repository.order, makeFindOrders(repository));
};

export const makeAmazonSNSOrderPublisher = () => {
  const topicArnByEvent: TopicArnByEvent = {
    onAccepted: environment.orderAcceptedSNSTopicArn,
    onCancelled: environment.orderCancelledSNSTopicArn,
  };

  return new AmazonSNSOrderPublisher(
    AmazonSNSService.getInstance().sns,
    topicArnByEvent,
  );
};

export const makeAcceptOrder = (repository: Repository) => {
  return new AcceptOrder(
    makeUpdateOrder(repository),
    makeAmazonSNSOrderPublisher(),
  );
};

export const makeCancelOrder = (repository: Repository) => {
  return new CancelOrder(
    makeUpdateOrder(repository),
    makeAmazonSNSOrderPublisher(),
  );
};

export const makeFindOrdersHttpController = (repository: Repository) => {
  return new CatchErrorHttpControllerDecorator(
    new FindOrdersHttpController(new FindOrders(repository.order)),
  );
};

export const makeAddOneOrderHttpController = (repository: Repository) => {
  const amazonSQSOrderMessenger = new AmazonSQSOrderMessenger(
    AmazonSQSService.getInstance().sqs,
    environment.orderAddedSQSQueueUrl,
  );

  return new CatchErrorHttpControllerDecorator(
    new AddOneOrderHttpController(
      new AddOrder(
        repository.order,
        repository.customer,
        repository.product,
        amazonSQSOrderMessenger,
      ),
    ),
  );
};

export const makeUpdateOrderStatusHttpController = (repository: Repository) => {
  return new CatchErrorHttpControllerDecorator(
    new UpdateOrderStatusHttpController(makeUpdateOrder(repository)),
  );
};

export const makeCheckOrderIsPaidHttpController = (repository: Repository) => {
  return new CatchErrorHttpControllerDecorator(
    new CheckOrderIsPaidHttpController(new FindOrders(repository.order)),
  );
};

export const makePayOrderHttpController = (repository: Repository) => {
  return new CatchErrorHttpControllerDecorator(
    new PayOrderHttpController(makeUpdateOrder(repository)),
  );
};
