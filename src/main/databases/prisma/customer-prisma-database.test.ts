import { CustomerPrismaDatabase } from './customer-prisma-database';

describe('CustomerPrismaDatabase', () => {
  describe('createOne', () => {
    it('should create one customer', async () => {
      // Arrange
      const data = {
        name: 'Customer Name',
        email: 'anyemail',
        document: 'anydocument',
      };
      const createdCustomer = {
        id: 'customer-id',
        ...data,
      };
      const prisma = {
        customer: {
          create: jest.fn().mockResolvedValue(createdCustomer),
        },
      } as any;
      const customerPrismaDatabase = new CustomerPrismaDatabase(prisma);
      // Act
      const returnedCustomer = await customerPrismaDatabase.createOne(data);
      // Assert
      expect(prisma.customer.create).toHaveBeenCalledWith({ data });
      expect(returnedCustomer).toEqual(createdCustomer);
    });
  });

  describe('findOneById', () => {
    it('should return one customer', async () => {
      // Arrange
      const customer = {
        id: 'customer-id',
        name: 'Customer Name',
        email: 'anyemail',
        document: 'anydocument',
      };
      const prisma = {
        customer: {
          findUnique: jest.fn().mockResolvedValue(customer),
        },
      } as any;
      const customerPrismaDatabase = new CustomerPrismaDatabase(prisma);
      // Act
      const returnedCustomer = await customerPrismaDatabase.findOneById(
        customer.id,
      );
      // Assert
      expect(prisma.customer.findUnique).toHaveBeenCalledWith({
        where: { id: customer.id },
      });
      expect(returnedCustomer).toEqual(customer);
    });

    it('should return null if customer does not exist', async () => {
      // Arrange
      const prisma = {
        customer: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      } as any;
      const customerPrismaDatabase = new CustomerPrismaDatabase(prisma);
      // Act
      const returnedCustomer = await customerPrismaDatabase.findOneById(
        'customer-id',
      );
      // Assert
      expect(prisma.customer.findUnique).toHaveBeenCalledWith({
        where: { id: 'customer-id' },
      });
      expect(returnedCustomer).toBeNull();
    });
  });

  describe('findOneByDocument', () => {
    it('should return one customer', async () => {
      // Arrange
      const customer = {
        id: 'customer-id',
        name: 'Customer Name',
        email: 'anyemail',
        document: 'anydocument',
      };
      const prisma = {
        customer: {
          findUnique: jest.fn().mockResolvedValue(customer),
        },
      } as any;
      const customerPrismaDatabase = new CustomerPrismaDatabase(prisma);
      // Act
      const returnedCustomer = await customerPrismaDatabase.findOneByDocument(
        customer.document,
      );
      // Assert
      expect(prisma.customer.findUnique).toHaveBeenCalledWith({
        where: { document: customer.document },
      });
      expect(returnedCustomer).toEqual(customer);
    });

    it('should return null if customer does not exist', async () => {
      // Arrange
      const prisma = {
        customer: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      } as any;
      const customerPrismaDatabase = new CustomerPrismaDatabase(prisma);
      // Act
      const returnedCustomer = await customerPrismaDatabase.findOneByDocument(
        'anydocument',
      );
      // Assert
      expect(prisma.customer.findUnique).toHaveBeenCalledWith({
        where: { document: 'anydocument' },
      });
      expect(returnedCustomer).toBeNull();
    });
  });

  describe('findOneByEmail', () => {
    it('should return one customer', async () => {
      // Arrange
      const customer = {
        id: 'customer-id',
        name: 'Customer Name',
        email: 'anyemail',
        document: 'anydocument',
      };
      const prisma = {
        customer: {
          findUnique: jest.fn().mockResolvedValue(customer),
        },
      } as any;
      const customerPrismaDatabase = new CustomerPrismaDatabase(prisma);
      // Act
      const returnedCustomer = await customerPrismaDatabase.findOneByEmail(
        customer.email,
      );
      // Assert
      expect(prisma.customer.findUnique).toHaveBeenCalledWith({
        where: { email: customer.email },
      });
      expect(returnedCustomer).toEqual(customer);
    });

    it('should return null if customer does not exist', async () => {
      // Arrange
      const prisma = {
        customer: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      } as any;
      const customerPrismaDatabase = new CustomerPrismaDatabase(prisma);
      // Act
      const returnedCustomer = await customerPrismaDatabase.findOneByEmail(
        'anyemail',
      );
      // Assert
      expect(prisma.customer.findUnique).toHaveBeenCalledWith({
        where: { email: 'anyemail' },
      });
      expect(returnedCustomer).toBeNull();
    });
  });
});
