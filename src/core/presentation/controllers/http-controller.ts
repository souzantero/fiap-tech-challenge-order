export interface HttpController<T> {
  handle(request: HttpRequest): Promise<HttpResponse<T>>;
}

export interface HttpRequest {
  body: any;
  params: any;
  query: any;
}

export class HttpResponse<T> {
  private constructor(
    public readonly status: HttpStatus,
    public readonly body?: T,
  ) {}

  static ok<T>(body?: T) {
    return new HttpResponse<T>(HttpStatus.Ok, body);
  }

  static created<T>(body?: T) {
    return new HttpResponse<T>(HttpStatus.Created, body);
  }

  static noContent<T>() {
    return new HttpResponse<T>(HttpStatus.NoContent);
  }
}

export enum HttpStatus {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  NotFound = 404,
  InternalServer = 500,
}

export class HttpError extends Error {
  constructor(public readonly status: HttpStatus, message: string) {
    super(message);
  }
}

export class InternalServerError extends HttpError {
  constructor(stack?: string) {
    super(HttpStatus.InternalServer, 'Internal server error');
    this.stack = stack;
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(HttpStatus.BadRequest, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(HttpStatus.NotFound, message);
  }
}
