import {
  AddOneCustomerHttpController,
  FindOneCustomerHttpController,
} from './customer-http-controller';
import { BadRequestError, NotFoundError } from './http-controller';

describe('AddOneCustomerHttpController', () => {
  describe('handle', () => {
    it('should add one customer', async () => {
      // Arrange
      const data = {
        name: 'Customer Name',
        email: 'anyemail',
        document: 'anydocument',
      };
      const customer = {
        id: 'customer-id',
        ...data,
      } as any;
      const addCustomer = {
        addOne: jest.fn().mockResolvedValue(customer),
      } as any;
      const addOneCustomerHttpController = new AddOneCustomerHttpController(
        addCustomer,
      );
      const request = {
        body: data,
      } as any;
      // Act
      const response = await addOneCustomerHttpController.handle(request);
      // Assert
      expect(addCustomer.addOne).toHaveBeenCalledWith(data);
      expect(response.status).toBe(201);
      expect(response.body).toBe(customer);
    });

    it('should throw BadRequestError if missing required fields', async () => {
      // Arrange
      const data = {
        name: 'Customer Name',
        email: 'anyemail',
      };
      const addCustomer = {
        addOne: jest.fn(),
      } as any;
      const addOneCustomerHttpController = new AddOneCustomerHttpController(
        addCustomer,
      );
      const request = {
        body: data,
      } as any;
      // Act
      const response = addOneCustomerHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(
        new BadRequestError('Missing required fields'),
      );
    });

    it('should throw BadRequestError if AddOneCustomerError', async () => {
      // Arrange
      const data = {
        name: 'Customer Name',
        email: 'anyemail',
        document: 'anydocument',
      };
      const addCustomer = {
        addOne: jest.fn().mockRejectedValue(new Error('AddOneCustomerError')),
      } as any;
      const addOneCustomerHttpController = new AddOneCustomerHttpController(
        addCustomer,
      );
      const request = {
        body: data,
      } as any;
      // Act
      const response = addOneCustomerHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(
        new BadRequestError('AddOneCustomerError'),
      );
    });
  });
});

describe('FindOneCustomerHttpController', () => {
  describe('handle', () => {
    it('should find one customer', async () => {
      // Arrange
      const customer = {
        id: 'customer-id',
        name: 'Customer Name',
        email: 'anyemail',
        document: 'anydocument',
      } as any;
      const findCustomer = {
        findOneByDocument: jest.fn().mockResolvedValue(customer),
      } as any;
      const findOneCustomerHttpController = new FindOneCustomerHttpController(
        findCustomer,
      );
      const request = {
        params: {
          document: 'anydocument',
        },
      } as any;
      // Act
      const response = await findOneCustomerHttpController.handle(request);
      // Assert
      expect(findCustomer.findOneByDocument).toHaveBeenCalledWith(
        request.params.document,
      );
      expect(response.status).toBe(200);
      expect(response.body).toBe(customer);
    });

    it('should throw NotFoundError if customer does not exist', async () => {
      // Arrange
      const findCustomer = {
        findOneByDocument: jest.fn().mockResolvedValue(null),
      } as any;
      const findOneCustomerHttpController = new FindOneCustomerHttpController(
        findCustomer,
      );
      const request = {
        params: {
          document: 'anydocument',
        },
      } as any;
      // Act
      const response = findOneCustomerHttpController.handle(request);
      // Assert
      await expect(response).rejects.toThrow(
        new NotFoundError('Customer not found'),
      );
    });
  });
});
