import { OrderPrismaDatabase } from './order-prisma-database';
import { PrismaDatabaseError } from './prisma-database';

describe('OrderPrismaDatabase', () => {
  describe('toModel', () => {
    it('should convert OrderPrismaEntity to Order', () => {
      // Arrange
      const order = {
        id: 'order-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        customerId: 'customer-id',
        status: 'RECEIVED',
        paid: false,
        orderProducts: [
          {
            id: 'order-product-id',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            orderId: 'order-id',
            productId: 'product-id',
            quantity: 1,
          },
        ],
      } as any;
      // Act
      const returnedOrder = OrderPrismaDatabase.toModel(order);
      // Assert
      expect(returnedOrder).toEqual({
        id: 'order-id',
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        deletedAt: null,
        customerId: 'customer-id',
        status: 'RECEIVED',
        paid: false,
        products: [
          {
            id: 'order-product-id',
            createdAt: order.orderProducts[0].createdAt,
            updatedAt: order.orderProducts[0].updatedAt,
            deletedAt: null,
            orderId: 'order-id',
            productId: 'product-id',
            quantity: 1,
          },
        ],
      });
    });

    it('should convert OrderPrismaEntity to Order without orderProducts', () => {
      // Arrange
      const order = {
        id: 'order-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        customerId: 'customer-id',
        status: 'RECEIVED',
        paid: false,
      } as any;
      // Act
      const returnedOrder = OrderPrismaDatabase.toModel(order);
      // Assert
      expect(returnedOrder).toEqual(order);
    });

    it('should throw PrismaDatabaseError if status is invalid', () => {
      // Arrange
      const order = {
        id: 'order-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        customerId: 'customer-id',
        status: 'invalid-status',
        paid: false,
      } as any;
      // Act
      const toModel = () => OrderPrismaDatabase.toModel(order);
      // Assert
      expect(toModel).toThrow(
        new PrismaDatabaseError('Invalid order status: invalid-status'),
      );
    });
  });

  describe('findOneById', () => {
    it('should return one order', async () => {
      // Arrange
      const order = {
        id: 'order-id',
        status: 'any-status',
        paid: false,
        orderProducts: [],
      };
      const prisma = {
        order: {
          findUnique: jest.fn().mockResolvedValue(order),
        },
      } as any;
      const orderPrismaDatabase = new OrderPrismaDatabase(prisma);
      OrderPrismaDatabase.toModel = jest.fn().mockReturnValue(order);
      // Act
      const returnedOrder = await orderPrismaDatabase.findOneById(order.id);
      // Assert
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: order.id },
        include: {
          orderProducts: true,
        },
      });
      expect(returnedOrder).toEqual(order);
    });

    it('should return null if order does not exist', async () => {
      // Arrange
      const prisma = {
        order: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      } as any;
      const orderPrismaDatabase = new OrderPrismaDatabase(prisma);
      // Act
      const returnedOrder = await orderPrismaDatabase.findOneById('order-id');
      // Assert
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-id' },
        include: {
          orderProducts: true,
        },
      });
      expect(returnedOrder).toBeNull();
    });
  });

  describe('findNotFinished', () => {
    it('should return not finished orders', async () => {
      // Arrange
      const order = {
        id: 'order-id',
        status: 'any-status',
        paid: false,
        orderProducts: [],
      };
      const prisma = {
        order: {
          findMany: jest.fn().mockResolvedValue([order]),
        },
      } as any;
      const orderPrismaDatabase = new OrderPrismaDatabase(prisma);
      OrderPrismaDatabase.toModel = jest.fn().mockReturnValue(order);
      // Act
      const returnedOrders = await orderPrismaDatabase.findNotFinished();
      // Assert
      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: {
          status: {
            notIn: ['FINISHED'],
          },
        },
        include: {
          orderProducts: true,
        },
      });
      expect(returnedOrders).toEqual([order]);
    });
  });

  describe('updateOneById', () => {
    it('should update one order', async () => {
      // Arrange
      const order = {
        id: 'order-id',
        status: 'any-status',
        paid: false,
        orderProducts: [],
      };
      const prisma = {
        order: {
          update: jest.fn().mockResolvedValue(order),
        },
      } as any;
      const orderPrismaDatabase = new OrderPrismaDatabase(prisma);
      OrderPrismaDatabase.toModel = jest.fn().mockReturnValue(order);
      const data = {
        status: 'any-status',
        paid: false,
      } as any;
      // Act
      const returnedOrder = await orderPrismaDatabase.updateOneById(
        order.id,
        data,
      );
      // Assert
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: order.id },
        data,
      });
      expect(returnedOrder).toEqual(order);
    });
  });

  describe('createOne', () => {
    it('should create one order', async () => {
      // Arrange
      const order = {
        id: 'order-id',
        status: 'any-status',
        paid: false,
        orderProducts: [],
      };
      const prisma = {
        order: {
          create: jest.fn().mockResolvedValue(order),
        },
      } as any;
      const orderPrismaDatabase = new OrderPrismaDatabase(prisma);
      OrderPrismaDatabase.toModel = jest.fn().mockReturnValue(order);
      const data = {
        status: 'any-status',
        paid: false,
        products: [
          {
            productId: 'product-id',
            quantity: 1,
          },
        ],
      } as any;
      // Act
      const returnedOrder = await orderPrismaDatabase.createOne(data);
      // Assert
      expect(prisma.order.create).toHaveBeenCalledWith({
        data: {
          status: 'any-status',
          paid: false,
          orderProducts: {
            create: [
              {
                productId: 'product-id',
                quantity: 1,
              },
            ],
          },
        },
        include: {
          orderProducts: true,
        },
      });
      expect(returnedOrder).toEqual(order);
    });
  });
});
