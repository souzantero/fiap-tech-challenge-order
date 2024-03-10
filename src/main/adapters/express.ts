import { Request, Response } from 'express';
import {
  HttpController,
  HttpError,
  HttpMiddleware,
} from '../../core/presentation/protocols/http';

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

export const adaptMiddleware = <T>(middleware: HttpMiddleware<T>) => {
  return async (req: Request, res: Response, next: any) => {
    const authorization = req.headers['authorization'] as string;
    const accessToken = authorization?.replace('Bearer ', '');

    const httpRequest = {
      accessToken,
      body: { ...req.body },
      params: { ...req.params },
      query: { ...req.query },
    };

    try {
      const httpResult = await middleware.handle(httpRequest);
      if (httpResult.status === 200) {
        Object.assign(req, httpResult.body);
        next();
      } else {
        res.status(httpResult.status).json(httpResult.body);
      }
    } catch (error) {
      const { status, message } = error as HttpError;
      return res.status(status).json({
        message,
      });
    }
  };
};
