import {
  Authenticator,
  SignUpData,
} from '../../../core/domain/protocols/authenticator';

export class AuthenticationFetchProvider implements Authenticator {
  constructor(private readonly url: string) {}

  async singUp(data: SignUpData): Promise<void> {
    const response = await fetch(`${this.url}/register`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to sing up');
    }
  }
}
