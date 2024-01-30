import { FindCustomer } from './find-customer';

describe('FindCustomer', () => {
  describe('findOneByDocument', () => {
    it('should be null', async () => {
      const customerRepository = {
        findOneByDocument: jest.fn().mockResolvedValue(null),
      } as any;
      const findCustomer = new FindCustomer(customerRepository);
      const customer = await findCustomer.findOneByDocument('12345678901');
      expect(customer).toBeNull();
    });
  });
});
