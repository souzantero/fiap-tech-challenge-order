import { Router } from 'express';
import { Repository } from '../../core/domain/repositories/repository';
import { adaptRoute } from './route';
import {
  makeAddOneCustomerHttpController,
  makeFindOneCustomerHttpController,
} from '../factories/customer-factories';

export const customerRoutes = (router: Router, repository: Repository) => {
  router.post(
    '/customers',
    adaptRoute(makeAddOneCustomerHttpController(repository)),
  );
  router.get(
    '/customers/document/:document',
    adaptRoute(makeFindOneCustomerHttpController(repository)),
  );
};
