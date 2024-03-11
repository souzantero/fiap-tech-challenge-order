import { Logger } from '../../core/domain/protocols/logger';

export class ConsoleAdapter implements Logger {
  info(message: string): void {
    console.log(message);
  }
}
