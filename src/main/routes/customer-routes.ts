import { Router } from 'express';
import { Repository } from '../../core/domain/repositories/repository';
import { adaptMiddleware, adaptRoute } from '../adapters/express';
import {
  makeAddOneCustomerHttpController,
  makeAnonymizeCustomerHttpController,
  makeFindOneCustomerHttpController,
} from '../factories/customer-factories';
import { makeAuthenticateHttpMiddleware } from '../factories/middlewares/authenticate-http-middleware-factory';

export const customerRoutes = (router: Router, repository: Repository) => {
  router.post(
    '/customers',
    adaptRoute(makeAddOneCustomerHttpController(repository)),
  );
  router.post(
    '/customers/anonymize',
    adaptMiddleware(makeAuthenticateHttpMiddleware(repository)),
    adaptRoute(makeAnonymizeCustomerHttpController(repository)),
  );
  router.get(
    '/customers/document/:document',
    adaptRoute(makeFindOneCustomerHttpController(repository)),
  );
};
