import { adaptRoute } from './route';

describe('adaptRoute', () => {
  it('should return a function', () => {
    // Arrange
    const controller = { handle: jest.fn() };

    // Act
    const sut = adaptRoute(controller);

    // Assert
    expect(sut).toBeInstanceOf(Function);
  });

  it('should call controller with correct values', async () => {
    // Arrange
    const request = {
      body: {
        any: 'any',
      },
      params: {
        any: 'any',
      },
      query: {
        any: 'any',
      },
    };
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValueOnce({ any: 'any' }),
    };
    const controller = {
      handle: jest
        .fn()
        .mockResolvedValueOnce({ status: 200, body: { any: 'any' } }),
    };
    const sut = adaptRoute(controller);

    // Act
    const result = await sut(request as any, response as any);

    // Assert
    expect(controller.handle).toHaveBeenCalledWith({
      body: {
        any: 'any',
      },
      params: {
        any: 'any',
      },
      query: {
        any: 'any',
      },
    });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ any: 'any' });
    expect(result).toEqual({ any: 'any' });
  });

  it('should return message and status if controller throws', async () => {
    // Arrange
    const request = {
      body: {
        any: 'any',
      },
      params: {
        any: 'any',
      },
      query: {
        any: 'any',
      },
    };
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValueOnce({ message: 'any' }),
    };
    const controller = {
      handle: jest.fn().mockRejectedValueOnce({ status: 400, message: 'any' }),
    };
    const sut = adaptRoute(controller);

    // Act
    const result = await sut(request as any, response as any);

    // Assert
    expect(controller.handle).toHaveBeenCalledWith({
      body: {
        any: 'any',
      },
      params: {
        any: 'any',
      },
      query: {
        any: 'any',
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: 'any' });
    expect(result).toEqual({ message: 'any' });
  });
});
