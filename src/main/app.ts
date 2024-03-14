import { Server } from 'node:http';
import express, { Router } from 'express';
import swagger from 'swagger-ui-express';
import helmet from 'helmet';

import openapi from './documentation/openapi.json';
import { Repository } from '../core/domain/repositories/repository';
import { customerRoutes } from './routes/customer-routes';
import { orderRoutes } from './routes/order-routes';

export class App {
  private constructor(private readonly app: express.Express) {}

  static create(repository: Repository) {
    const app = express();
    app.use(helmet());
    app.use((_, res, next) => {
      res.setHeader('Cache-Control', 'no-store');
      next();
    });
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    const router = Router();
    customerRoutes(router, repository);
    orderRoutes(router, repository);

    router.get('/health', (_, res) =>
      res.status(200).json({
        uptime: process.uptime(),
      }),
    );

    app.use('/api', router);
    app.use('/api/docs', swagger.serve, swagger.setup(openapi));
    app.use((_, res) => res.status(404).json({ message: 'Not Found' }));

    return new App(app);
  }

  get express(): express.Express {
    return this.app;
  }

  start(port: number): Server {
    return this.app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  }
}
