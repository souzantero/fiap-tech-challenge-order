import { Request, Response } from 'express';
import {
  HttpController,
  HttpError,
} from '../../core/presentation/controllers/http-controller';

export const adaptRoute = <T>(httpController: HttpController<T>) => {
  return async (req: Request, res: Response) => {
    const httpRequest = {
      body: { ...req.body },
      params: { ...req.params },
      query: { ...req.query },
    };

    try {
      const httpResult = await httpController.handle(httpRequest);
      return res.status(httpResult.status).json(httpResult.body);
    } catch (error) {
      const { status, message } = error as HttpError;
      return res.status(status).json({
        message,
      });
    }
  };
};
