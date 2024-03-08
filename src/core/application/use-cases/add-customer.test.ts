import { AddCustomer } from './add-customer';

describe('AddCustomer', () => {
  describe('addOne', () => {
    it('should add one customer', async () => {
      // Arrange
      const data = {
        name: 'Customer Name',
        email: 'anyemail',
        document: 'anydocument',
      };

      const createdCustomer = {
        id: 'customer-id',
        ...data,
      } as any;

      const customerRepository = {
        createOne: jest.fn().mockResolvedValue(createdCustomer),
        findOneByDocument: jest.fn().mockResolvedValue(null),
        findOneByEmail: jest.fn().mockResolvedValue(null),
      } as any;

      const authenticator = {
        signUp: jest.fn().mockResolvedValue(null),
      } as any;

      const addCustomer = new AddCustomer(customerRepository, authenticator);

      // Act
      const returnedCustomer = await addCustomer.addOne({
        ...data,
        password: 'anypassword',
      });

      // Assert
      expect(customerRepository.findOneByDocument).toHaveBeenCalledWith(
        data.document,
      );

      expect(customerRepository.findOneByEmail).toHaveBeenCalledWith(
        data.email,
      );

      expect(customerRepository.createOne).toHaveBeenCalledWith(data);

      expect(returnedCustomer).toBe(createdCustomer);
    });

    it('should throw AddOneCustomerError if customer already exists by document', async () => {
      // Arrange
      const data = {
        name: 'Customer Name',
        email: 'anyemail',
        document: 'anydocument',
        password: 'anypassword',
      };

      const customerRepository = {
        findOneByDocument: jest.fn().mockResolvedValue(data),
        findOneByEmail: jest.fn().mockResolvedValue(null),
      } as any;

      const authenticator = {
        signUp: jest.fn().mockResolvedValue(null),
      } as any;

      const addCustomer = new AddCustomer(customerRepository, authenticator);

      // Act
      const addOneCustomer = addCustomer.addOne(data);

      // Assert
      await expect(addOneCustomer).rejects.toThrowError(
        'Customer already exists',
      );

      expect(customerRepository.findOneByDocument).toHaveBeenCalledWith(
        data.document,
      );

      expect(customerRepository.findOneByEmail).not.toHaveBeenCalled();
    });

    it('should throw AddOneCustomerError if customer already exists by email', async () => {
      // Arrange
      const data = {
        name: 'Customer Name',
        email: 'anyemail',
        document: 'anydocument',
        password: 'anypassword',
      };

      const customerRepository = {
        findOneByDocument: jest.fn().mockResolvedValue(null),
        findOneByEmail: jest.fn().mockResolvedValue(data),
      } as any;

      const authenticator = {
        signUp: jest.fn().mockResolvedValue(null),
      } as any;

      const addCustomer = new AddCustomer(customerRepository, authenticator);

      // Act
      const addOneCustomer = addCustomer.addOne(data);

      // Assert
      await expect(addOneCustomer).rejects.toThrowError(
        'Customer already exists',
      );

      expect(customerRepository.findOneByDocument).toHaveBeenCalledWith(
        data.document,
      );

      expect(customerRepository.findOneByEmail).toHaveBeenCalledWith(
        data.email,
      );
    });
  });
});
