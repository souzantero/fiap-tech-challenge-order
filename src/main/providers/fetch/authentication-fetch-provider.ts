import { Authorizer } from '../../../core/domain/protocols/authorizer';
import {
  Authenticator,
  SignUpData,
} from '../../../core/domain/protocols/authenticator';

export class AuthenticationFetchProvider implements Authenticator, Authorizer {
  constructor(private readonly url: string) {}

  async signUp(data: SignUpData): Promise<void> {
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

  async authorize(accessToken: string): Promise<string> {
    const response = await fetch(`${this.url}/authorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Unauthorized');
    }

    const data = await response.json();
    return data.message;
  }
}
