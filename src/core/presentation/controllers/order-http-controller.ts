import { Order } from '../../domain/entities/order';
import {
  AddOneOrderData,
  AddOrder,
  CustomerNotFoundError,
  FindOneOrderByIdError,
  FindOrders,
  ProductsNotFoundError,
  UpdateOrder,
} from '../../application/use-cases';
import {
  BadRequestError,
  HttpController,
  HttpRequest,
  HttpResponse,
} from './http-controller';

export class AddOneOrderHttpController implements HttpController<Order> {
  constructor(private readonly addOrder: AddOrder) {}

  async handle(request: HttpRequest): Promise<HttpResponse<Order>> {
    const { customerId, products } = request.body;
    const data: AddOneOrderData = { customerId, products };

    if (!data.customerId) {
      throw new BadRequestError('Missing customerId');
    }

    if (!data.products || data.products.length === 0) {
      throw new BadRequestError('Missing products');
    }

    const hasInvalidProduct = data.products.some(
      (product) => !product.productId || !product.quantity,
    );
    if (hasInvalidProduct) {
      throw new BadRequestError('Invalid products');
    }

    try {
      const order = await this.addOrder.addOne(data);
      return HttpResponse.created(order);
    } catch (error) {
      if (error instanceof CustomerNotFoundError)
        throw new BadRequestError('Customer not found');
      else if (error instanceof ProductsNotFoundError)
        throw new BadRequestError(error.message);
      throw error;
    }
  }
}

export class UpdateOrderStatusHttpController implements HttpController<Order> {
  constructor(private readonly updateOrder: UpdateOrder) {}

  async handle(request: HttpRequest): Promise<HttpResponse<Order>> {
    const { id } = request.params;
    const { status } = request.body;

    if (!status) {
      throw new BadRequestError('Missing status');
    }

    try {
      const order = await this.updateOrder.updateOneById(id, { status });
      return HttpResponse.ok(order);
    } catch (error) {
      if (error instanceof FindOneOrderByIdError)
        throw new BadRequestError('Order not found');
      throw error;
    }
  }
}

export class FindOrdersHttpController implements HttpController<Order[]> {
  constructor(private readonly findOrders: FindOrders) {}

  async handle(): Promise<HttpResponse<Order[]>> {
    const orders = await this.findOrders.findAll();
    return HttpResponse.ok(orders);
  }
}

export class CheckOrderIsPaidHttpController
  implements HttpController<{ paid: boolean }>
{
  constructor(private readonly findOrders: FindOrders) {}

  async handle(request: HttpRequest): Promise<HttpResponse<{ paid: boolean }>> {
    const { id } = request.params;

    try {
      const order = await this.findOrders.findOneById(id);
      return HttpResponse.ok({ paid: order.paid });
    } catch (error) {
      if (error instanceof FindOneOrderByIdError)
        throw new BadRequestError('Order not found');
      throw error;
    }
  }
}

export class MercadoPagoWebhookHttpController implements HttpController<void> {
  constructor(private readonly updateOrder: UpdateOrder) {}

  async handle(request: HttpRequest): Promise<HttpResponse<void>> {
    const { id } = request.params;
    const { status } = request.body;

    if (!status) {
      throw new BadRequestError('Missing status');
    }

    try {
      const paid = status === 'approved';
      await this.updateOrder.updateOneById(id, { paid });
      return HttpResponse.noContent();
    } catch (error) {
      if (error instanceof FindOneOrderByIdError)
        throw new BadRequestError('Order not found');
      throw error;
    }
  }
}
