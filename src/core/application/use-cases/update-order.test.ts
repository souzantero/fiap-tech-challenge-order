import { UpdateOrder } from './update-order';

describe('UpdateOrder', () => {
  describe('updateOneById', () => {
    it('should update one order by id', async () => {
      // Arrange
      const id = 'order-id';
      const data = {
        status: 'APPROVED',
      } as any;
      const orderRepository = {
        updateOneById: jest.fn().mockResolvedValue(null),
      } as any;
      const findOrders = {
        findOneById: jest.fn().mockResolvedValue(null),
      } as any;
      const updateOrder = new UpdateOrder(orderRepository, findOrders);
      // Act
      await updateOrder.updateOneById(id, data);
      // Assert
      expect(findOrders.findOneById).toHaveBeenCalledWith(id);
      expect(orderRepository.updateOneById).toHaveBeenCalledWith(id, data);
    });
  });
});
