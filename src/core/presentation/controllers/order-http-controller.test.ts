import {
  CustomerNotFoundError,
  FindOneOrderByIdError,
  ProductsNotFoundError,
} from '../../application/use-cases';
import { BadRequestError } from './http-controller';
import {
  AddOneOrderHttpController,
  CheckOrderIsPaidHttpController,
  FindOrdersHttpController,
  PayOrderHttpController,
  UpdateOrderStatusHttpController,
} from './order-http-controller';

describe('AddOneOrderHttpController', () => {
  describe('handle', () => {
    it('should add one order', async () => {
      // Arrange
      const data = {
        customerId: 'customer-id',
        products: [
          {
            productId: 'product-id',
            quantity: 2,
          },
        ],
      };
      const createdOrder = {
        id: 'order-id',
        ...data,
      } as any;
      const addOrder = {
        addOne: jest.fn().mockResolvedValue(createdOrder),
      } as any;
      const addOneOrderHttpController = new AddOneOrderHttpController(addOrder);
      const request = {
        body: data,
      } as any;
      // Act
      const response = await addOneOrderHttpController.handle(request);
      // Assert
      expect(addOrder.addOne).toHaveBeenCalledWith(data);
      expect(response).toEqual({
        status: 201,
        body: createdOrder,
      });
    });

    it('should throw BadRequestError if missing customerId', async () => {
      // Arrange
      const data = {
        products: [
          {
            productId: 'product-id',
            quantity: 2,
          },
        ],
      };
      const addOrder = {
        addOne: jest.fn(),
      } as any;
      const addOneOrderHttpController = new AddOneOrderHttpController(addOrder);
      const request = {
        body: data,
      } as any;
      // Act
      const response = addOneOrderHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(
        new BadRequestError('Missing customerId'),
      );
    });

    it('should throw BadRequestError if missing products', async () => {
      // Arrange
      const data = {
        customerId: 'customer-id',
      };
      const addOrder = {
        addOne: jest.fn(),
      } as any;
      const addOneOrderHttpController = new AddOneOrderHttpController(addOrder);
      const request = {
        body: data,
      } as any;
      // Act
      const response = addOneOrderHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(
        new BadRequestError('Missing products'),
      );
    });

    it('should throw BadRequestError if invalid products', async () => {
      // Arrange
      const data = {
        customerId: 'customer-id',
        products: [
          {
            productId: 'product-id',
          },
        ],
      };
      const addOrder = {
        addOne: jest.fn(),
      } as any;
      const addOneOrderHttpController = new AddOneOrderHttpController(addOrder);
      const request = {
        body: data,
      } as any;
      // Act
      const response = addOneOrderHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(
        new BadRequestError('Invalid products'),
      );
    });

    it('should throw BadRequestError if CustomerNotFoundError', async () => {
      // Arrange
      const data = {
        customerId: 'customer-id',
        products: [
          {
            productId: 'product-id',
            quantity: 2,
          },
        ],
      };
      const addOrder = {
        addOne: jest.fn().mockRejectedValue(new CustomerNotFoundError()),
      } as any;
      const addOneOrderHttpController = new AddOneOrderHttpController(addOrder);
      const request = {
        body: data,
      } as any;
      // Act
      const response = addOneOrderHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(
        new BadRequestError('Customer not found'),
      );
    });

    it('should throw BadRequestError if ProductsNotFoundError', async () => {
      // Arrange
      const data = {
        customerId: 'customer-id',
        products: [
          {
            productId: 'product-id',
            quantity: 2,
          },
        ],
      };
      const addOrder = {
        addOne: jest
          .fn()
          .mockRejectedValue(new ProductsNotFoundError(['product-id'])),
      } as any;
      const addOneOrderHttpController = new AddOneOrderHttpController(addOrder);
      const request = {
        body: data,
      } as any;
      // Act
      const response = addOneOrderHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(
        new BadRequestError('Products not found: product-id'),
      );
    });

    it('should throw error', async () => {
      // Arrange
      const data = {
        customerId: 'customer-id',
        products: [
          {
            productId: 'product-id',
            quantity: 2,
          },
        ],
      };
      const addOrder = {
        addOne: jest.fn().mockRejectedValue(new Error('UnexpectedError')),
      } as any;
      const addOneOrderHttpController = new AddOneOrderHttpController(addOrder);
      const request = {
        body: data,
      } as any;
      // Act
      const response = addOneOrderHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(new Error('UnexpectedError'));
    });
  });
});

describe('UpdateOrderStatusHttpController', () => {
  describe('handle', () => {
    it('should update order status', async () => {
      // Arrange
      const id = 'order-id';
      const data = {
        status: 'status',
      };
      const updatedOrder = {
        id,
        ...data,
      } as any;
      const updateOrder = {
        updateOneById: jest.fn().mockResolvedValue(updatedOrder),
      } as any;
      const updateOrderStatusHttpController =
        new UpdateOrderStatusHttpController(updateOrder);
      const request = {
        params: { id },
        body: data,
      } as any;
      // Act
      const response = await updateOrderStatusHttpController.handle(request);
      // Assert
      expect(updateOrder.updateOneById).toHaveBeenCalledWith(id, data);
      expect(response).toEqual({
        status: 200,
        body: updatedOrder,
      });
    });

    it('should throw BadRequestError if missing status', async () => {
      // Arrange
      const id = 'order-id';
      const data = {};
      const updateOrder = {
        updateOneById: jest.fn(),
      } as any;
      const updateOrderStatusHttpController =
        new UpdateOrderStatusHttpController(updateOrder);
      const request = {
        params: { id },
        body: data,
      } as any;
      // Act
      const response = updateOrderStatusHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(
        new BadRequestError('Missing status'),
      );
    });

    it('should throw BadRequestError if FindOneOrderByIdError', async () => {
      // Arrange
      const id = 'order-id';
      const data = {
        status: 'status',
      };
      const updateOrder = {
        updateOneById: jest
          .fn()
          .mockRejectedValue(new FindOneOrderByIdError('Order not found')),
      } as any;
      const updateOrderStatusHttpController =
        new UpdateOrderStatusHttpController(updateOrder);
      const request = {
        params: { id },
        body: data,
      } as any;
      // Act
      const response = updateOrderStatusHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(
        new BadRequestError('Order not found'),
      );
    });

    it('should throw error', async () => {
      // Arrange
      const id = 'order-id';
      const data = {
        status: 'status',
      };
      const updateOrder = {
        updateOneById: jest
          .fn()
          .mockRejectedValue(new Error('UnexpectedError')),
      } as any;
      const updateOrderStatusHttpController =
        new UpdateOrderStatusHttpController(updateOrder);
      const request = {
        params: { id },
        body: data,
      } as any;
      // Act
      const response = updateOrderStatusHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(new Error('UnexpectedError'));
    });
  });
});

describe('FindOrdersHttpController', () => {
  describe('handle', () => {
    it('should find orders', async () => {
      // Arrange
      const orders = [
        {
          id: 'order-id',
        },
      ] as any;
      const findOrders = {
        findAll: jest.fn().mockResolvedValue(orders),
      } as any;
      const findOrdersHttpController = new FindOrdersHttpController(findOrders);
      // Act
      const response = await findOrdersHttpController.handle();
      // Assert
      expect(response).toEqual({
        status: 200,
        body: orders,
      });
    });
  });
});

describe('CheckOrderIsPaidHttpController', () => {
  describe('handle', () => {
    it('should check if order is paid', async () => {
      // Arrange
      const id = 'order-id';
      const order = {
        id,
        paid: true,
      } as any;
      const findOrders = {
        findOneById: jest.fn().mockResolvedValue(order),
      } as any;
      const checkOrderIsPaidHttpController = new CheckOrderIsPaidHttpController(
        findOrders,
      );
      const request = {
        params: { id },
      } as any;
      // Act
      const response = await checkOrderIsPaidHttpController.handle(request);
      // Assert
      expect(findOrders.findOneById).toHaveBeenCalledWith(id);
      expect(response).toEqual({
        status: 200,
        body: { paid: true },
      });
    });

    it('should throw BadRequestError if FindOneOrderByIdError', async () => {
      // Arrange
      const id = 'order-id';
      const findOrders = {
        findOneById: jest
          .fn()
          .mockRejectedValue(new FindOneOrderByIdError('Order not found')),
      } as any;
      const checkOrderIsPaidHttpController = new CheckOrderIsPaidHttpController(
        findOrders,
      );
      const request = {
        params: { id },
      } as any;
      // Act
      const response = checkOrderIsPaidHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(
        new BadRequestError('Order not found'),
      );
    });

    it('should throw error', async () => {
      // Arrange
      const id = 'order-id';
      const findOrders = {
        findOneById: jest.fn().mockRejectedValue(new Error('UnexpectedError')),
      } as any;
      const checkOrderIsPaidHttpController = new CheckOrderIsPaidHttpController(
        findOrders,
      );
      const request = {
        params: { id },
      } as any;
      // Act
      const response = checkOrderIsPaidHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(new Error('UnexpectedError'));
    });
  });
});

describe('PayOrderHttpController', () => {
  describe('handle', () => {
    it('should pay order', async () => {
      // Arrange
      const id = 'order-id';
      const updateOrder = {
        updateOneById: jest.fn().mockResolvedValue({}),
      } as any;
      const payOrderHttpController = new PayOrderHttpController(updateOrder);
      const request = {
        params: { id },
      } as any;
      // Act
      const response = await payOrderHttpController.handle(request);
      // Assert
      expect(updateOrder.updateOneById).toHaveBeenCalledWith(id, {
        paid: true,
      });
      expect(response).toEqual({
        status: 204,
      });
    });

    it('should throw BadRequestError if FindOneOrderByIdError', async () => {
      // Arrange
      const id = 'order-id';
      const updateOrder = {
        updateOneById: jest
          .fn()
          .mockRejectedValue(new FindOneOrderByIdError('Order not found')),
      } as any;
      const payOrderHttpController = new PayOrderHttpController(updateOrder);
      const request = {
        params: { id },
      } as any;
      // Act
      const response = payOrderHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(
        new BadRequestError('Order not found'),
      );
    });

    it('should throw error', async () => {
      // Arrange
      const id = 'order-id';
      const updateOrder = {
        updateOneById: jest
          .fn()
          .mockRejectedValue(new Error('UnexpectedError')),
      } as any;
      const payOrderHttpController = new PayOrderHttpController(updateOrder);
      const request = {
        params: { id },
      } as any;
      // Act
      const response = payOrderHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(new Error('UnexpectedError'));
    });
  });
});
