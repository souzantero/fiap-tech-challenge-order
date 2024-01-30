import { OrderStatus } from '../../domain/entities/order';
import { FindOneOrderByIdError, FindOrders } from './find-orders';

describe('FindOrders', () => {
  describe('findOneById', () => {
    it('should return order', async () => {
      // Arrange
      const orderFound = {
        id: '1',
      };
      const orderRepository = {
        findOneById: jest.fn().mockResolvedValue(orderFound),
      } as any;
      const findOrders = new FindOrders(orderRepository);
      // Act
      const order = await findOrders.findOneById('1');
      // Assert
      expect(order).toBe(orderFound);
    });

    it('should throw error when order not found', async () => {
      // Arrange
      const orderRepository = {
        findOneById: jest.fn().mockResolvedValue(null),
      } as any;
      const findOrders = new FindOrders(orderRepository);
      // Act
      const promise = findOrders.findOneById('1');
      // Assert
      await expect(promise).rejects.toThrow(
        new FindOneOrderByIdError('Order not found: 1'),
      );
    });
  });

  describe('findAll', () => {
    it('should return orders', async () => {
      // Arrange
      const ordersFound = [
        {
          id: '1',
          status: 'any',
        },
      ];
      const orderRepository = {
        findNotFinished: jest.fn().mockResolvedValue(ordersFound),
      } as any;
      const findOrders = new FindOrders(orderRepository);
      findOrders['sortOrdersByStatus'] = jest.fn().mockReturnValue(ordersFound);
      // Act
      const orders = await findOrders.findAll();
      // Assert
      expect(orders).toBe(ordersFound);
      expect(findOrders['sortOrdersByStatus']).toHaveBeenCalledWith(
        ordersFound,
      );
    });
  });

  describe('getStatusOrder', () => {
    it('should return 1 when status is Ready', () => {
      // Arrange
      const findOrders = new FindOrders(null as any);
      // Act
      const statusOrder = findOrders['getStatusOrder'](OrderStatus.Ready);
      // Assert
      expect(statusOrder).toBe(1);
    });

    it('should return 2 when status is Preparing', () => {
      // Arrange
      const findOrders = new FindOrders(null as any);
      // Act
      const statusOrder = findOrders['getStatusOrder'](OrderStatus.Preparing);
      // Assert
      expect(statusOrder).toBe(2);
    });

    it('should return 3 when status is Received', () => {
      // Arrange
      const findOrders = new FindOrders(null as any);
      // Act
      const statusOrder = findOrders['getStatusOrder'](OrderStatus.Received);
      // Assert
      expect(statusOrder).toBe(3);
    });

    it('should throw error when status is invalid', () => {
      // Arrange
      const findOrders = new FindOrders(null as any);
      // Act
      // Assert
      return expect(() => findOrders['getStatusOrder']('any' as any)).toThrow(
        new Error('Invalid order status: any'),
      );
    });
  });

  describe('compareStatusOrder', () => {
    it('should return -1 when a < b', () => {
      // Arrange
      const findOrders = new FindOrders(null as any);
      // Act
      const statusOrder = findOrders['compareStatusOrder'](
        OrderStatus.Ready,
        OrderStatus.Preparing,
      );
      // Assert
      expect(statusOrder).toBe(-1);
    });

    it('should return 1 when a > b', () => {
      // Arrange
      const findOrders = new FindOrders(null as any);
      // Act
      const statusOrder = findOrders['compareStatusOrder'](
        OrderStatus.Preparing,
        OrderStatus.Ready,
      );
      // Assert
      expect(statusOrder).toBe(1);
    });

    it('should return 0 when a = b', () => {
      // Arrange
      const findOrders = new FindOrders(null as any);
      // Act
      const statusOrder = findOrders['compareStatusOrder'](
        OrderStatus.Preparing,
        OrderStatus.Preparing,
      );
      // Assert
      expect(statusOrder).toBe(0);
    });
  });

  describe('sortOrdersByStatus', () => {
    it('should call compareStatusOrder', () => {
      // Arrange
      const orders = [{ status: 'any' }, { status: 'any' }] as any;

      const findOrders = new FindOrders(null as any);
      findOrders['compareStatusOrder'] = jest.fn();
      // Act
      findOrders['sortOrdersByStatus'](orders);
      // Assert
      expect(findOrders['compareStatusOrder']).toHaveBeenCalled();
    });
  });
});
