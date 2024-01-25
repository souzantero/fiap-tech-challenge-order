import { Router } from 'express';
import { Repository } from '../../core/domain/repositories/repository';
import {
  makeAddOneOrderHttpController,
  makeCheckOrderIsPaidHttpController,
  makeFindOrdersHttpController,
  makeMercadoPagoWebhookHttpController,
  makeUpdateOrderStatusHttpController,
} from '../factories/order-factories';
import { adaptRoute } from './route';

export const orderRoutes = (router: Router, repository: Repository) => {
  router.post(
    '/orders/checkout',
    adaptRoute(makeAddOneOrderHttpController(repository)),
  );
  router.post(
    '/orders/:id/hooks/mercado-pago',
    adaptRoute(makeMercadoPagoWebhookHttpController(repository)),
  );
  router.get('/orders', adaptRoute(makeFindOrdersHttpController(repository)));
  router.get(
    '/orders/:id/paid',
    adaptRoute(makeCheckOrderIsPaidHttpController(repository)),
  );
  router.patch(
    '/orders/:id/status',
    adaptRoute(makeUpdateOrderStatusHttpController(repository)),
  );
};
