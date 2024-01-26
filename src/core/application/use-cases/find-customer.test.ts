import { CustomerInMemoryDatabase } from '../../../main/databases/in-memory/customer-in-memory-database';
import { FindCustomer } from './find-customer';

describe('FindCustomer', () => {
  describe('findOneByDocument', () => {
    it('should be null', async () => {
      const customerRepository = new CustomerInMemoryDatabase();
      const findCustomer = new FindCustomer(customerRepository);
      const customer = await findCustomer.findOneByDocument('12345678901');
      expect(customer).toBeNull();
    });
  });
});
