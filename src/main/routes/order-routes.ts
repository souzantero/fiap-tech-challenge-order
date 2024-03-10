import { Router } from 'express';
import { Repository } from '../../core/domain/repositories/repository';
import {
  makeAddOneOrderHttpController,
  makeCheckOrderIsPaidHttpController,
  makeFindOrdersHttpController,
  makePayOrderHttpController,
  makeUpdateOrderStatusHttpController,
} from '../factories/order-factories';
import { adaptMiddleware, adaptRoute } from '../adapters/express';
import { makeAuthenticateHttpMiddleware } from '../factories/middlewares/authenticate-http-middleware-factory';

export const orderRoutes = (router: Router, repository: Repository) => {
  router.post(
    '/orders/checkout',
    adaptMiddleware(makeAuthenticateHttpMiddleware(repository)),
    adaptRoute(makeAddOneOrderHttpController(repository)),
  );
  router.get('/orders', adaptRoute(makeFindOrdersHttpController(repository)));
  router.get(
    '/orders/:id/paid',
    adaptRoute(makeCheckOrderIsPaidHttpController(repository)),
  );
  router.post(
    '/orders/:id/pay',
    adaptMiddleware(makeAuthenticateHttpMiddleware(repository)),
    adaptRoute(makePayOrderHttpController(repository)),
  );
  router.patch(
    '/orders/:id/status',
    adaptMiddleware(makeAuthenticateHttpMiddleware(repository)),
    adaptRoute(makeUpdateOrderStatusHttpController(repository)),
  );
};
