import { PrismaDatabase } from './prisma-database';

describe('PrismaDatabase', () => {
  describe('connect', () => {
    it('should connect to database', async () => {
      // Arrange
      const prisma = {
        $connect: jest.fn(),
      } as any;
      const database = new PrismaDatabase(prisma);
      // Act
      await database.connect();
      // Assert
      expect(prisma.$connect).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('should disconnect from database', async () => {
      // Arrange
      const prisma = {
        $disconnect: jest.fn(),
      } as any;
      const database = new PrismaDatabase(prisma);
      // Act
      await database.disconnect();
      // Assert
      expect(prisma.$disconnect).toHaveBeenCalled();
    });
  });

  describe('drop', () => {
    it('should drop database', async () => {
      // Arrange
      const prisma = {
        customer: {
          deleteMany: jest.fn(),
        },
        order: {
          deleteMany: jest.fn(),
        },
      } as any;
      const database = new PrismaDatabase(prisma);
      // Act
      await database.drop();
      // Assert
      expect(prisma.customer.deleteMany).toHaveBeenCalled();
      expect(prisma.order.deleteMany).toHaveBeenCalled();
    });
  });
});
