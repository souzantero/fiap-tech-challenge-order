import { OrderStatus } from '../../domain/entities/order';
import {
  AddOrder,
  CustomerNotFoundError,
  ProductsNotFoundError,
} from './add-order';

describe('AddOrder', () => {
  describe('addOne', () => {
    it('should add one order', async () => {
      // Arrange
      const data = {
        customerId: 'customer-id',
        products: [
          {
            productId: 'product-id',
            quantity: 1,
          },
        ],
      };
      const customer = {
        id: 'customer-id',
        name: 'Customer Name',
        email: 'anyemail',
        document: 'anydocument',
      } as any;
      const product = {
        id: 'product-id',
        name: 'Product Name',
        price: 10,
        quantity: 1,
      } as any;
      const order = {
        id: 'order-id',
        customerId: 'customer-id',
        products: [
          {
            productId: 'product-id',
            quantity: 1,
          },
        ],
        status: OrderStatus.Received,
        paid: false,
      } as any;
      const orderRepository = {
        createOne: jest.fn().mockResolvedValue(order),
      } as any;
      const findOneCustomer = {
        findOneById: jest.fn().mockResolvedValue(customer),
      } as any;
      const findManyProducts = {
        findManyByIds: jest.fn().mockResolvedValue([product]),
      } as any;
      const orderAddedEvent = {
        onAdded: jest.fn(),
      } as any;
      const addOrder = new AddOrder(
        orderRepository,
        findOneCustomer,
        findManyProducts,
        orderAddedEvent,
      );
      // Act
      const returnedOrder = await addOrder.addOne(data);
      // Assert
      expect(findOneCustomer.findOneById).toHaveBeenCalledWith(data.customerId);
      expect(findManyProducts.findManyByIds).toHaveBeenCalledWith([
        data.products[0].productId,
      ]);
      expect(orderRepository.createOne).toHaveBeenCalledWith({
        ...data,
        status: OrderStatus.Received,
        paid: false,
      });
      expect(returnedOrder).toBe(order);
    });

    it('should throw CustomerNotFoundError if customer does not exist', async () => {
      // Arrange
      const data = {
        customerId: 'customer-id',
        products: [
          {
            productId: 'product-id',
            quantity: 1,
          },
        ],
      };
      const findOneCustomer = {
        findOneById: jest.fn().mockResolvedValue(null),
      } as any;
      const addOrder = new AddOrder(
        null as any,
        findOneCustomer,
        null as any,
        null as any,
      );
      // Act
      const addOneOrder = addOrder.addOne(data);
      // Assert
      await expect(addOneOrder).rejects.toThrow(new CustomerNotFoundError());
    });

    it('should throw ProductsNotFoundError if products does not exist', async () => {
      // Arrange
      const data = {
        customerId: 'customer-id',
        products: [
          {
            productId: 'product-id',
            quantity: 1,
          },
        ],
      };
      const customer = {
        id: 'customer-id',
        name: 'Customer Name',
        email: 'anyemail',
        document: 'anydocument',
      } as any;
      const findOneCustomer = {
        findOneById: jest.fn().mockResolvedValue(customer),
      } as any;
      const findManyProducts = {
        findManyByIds: jest.fn().mockResolvedValue([]),
      } as any;
      const addOrder = new AddOrder(
        null as any,
        findOneCustomer,
        findManyProducts,
        null as any,
      );
      // Act
      const addOneOrder = addOrder.addOne(data);
      // Assert
      await expect(addOneOrder).rejects.toThrow(
        new ProductsNotFoundError(['product-id']),
      );
    });
  });
});
