import {
  HttpController,
  HttpError,
  HttpRequest,
  HttpResponse,
  InternalServerError,
} from '../protocols/http';

export class CatchErrorHttpControllerDecorator<T> implements HttpController<T> {
  constructor(private readonly httpController: HttpController<T>) {}

  async handle(request: HttpRequest): Promise<HttpResponse<T>> {
    try {
      return await this.httpController.handle(request);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      console.error(error);
      const { stack } = error as Error;
      throw new InternalServerError(stack);
    }
  }
}
