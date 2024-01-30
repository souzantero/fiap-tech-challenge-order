import {
  BadRequestError,
  InternalServerError,
} from '../controllers/http-controller';
import { CatchErrorHttpControllerDecorator } from './catch-error-http-controller-decorator';

describe('CatchErrorHttpControllerDecorator', () => {
  describe('handle', () => {
    beforeEach(() => {
      // mock console.error to avoid log in console
      console.error = jest.fn();
    });

    it('should throw a error if httpController throws a HttpError', async () => {
      // Arrange
      const httpController = {
        handle: jest.fn().mockRejectedValue(new BadRequestError('any_message')),
      };

      const sut = new CatchErrorHttpControllerDecorator(httpController as any);
      const request = {} as any;

      // Act
      const promise = sut.handle(request);

      // Assert
      expect(promise).rejects.toThrow(new BadRequestError('any_message'));
    });

    it('should throw a InternalServerError if httpController throws a error', async () => {
      // Arrange
      const httpController = {
        handle: jest.fn().mockRejectedValue(new Error('any_message')),
      };

      const sut = new CatchErrorHttpControllerDecorator(httpController as any);
      const request = {} as any;

      // Act
      const promise = sut.handle(request);

      // Assert
      expect(promise).rejects.toThrow(new InternalServerError());
    });
  });
});
