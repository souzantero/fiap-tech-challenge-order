import * as bcrypt from 'bcrypt';
import { Hasher } from '../../core/domain/protocols/hasher';

export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}

  async hash(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, this.salt);
  }
}
