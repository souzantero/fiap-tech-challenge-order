import { connect, Channel, Connection } from 'amqplib';
import { environment } from '../../configuration/environment';

export class RabbitMQService {
  private static instance: RabbitMQService;

  private constructor(
    public readonly connection: Connection,
    public readonly channel: Channel,
  ) {}

  private static async create(amqpUrl: string): Promise<RabbitMQService> {
    const connection = await connect(amqpUrl);
    const channel = await connection.createChannel();
    return new RabbitMQService(connection, channel);
  }

  public static async getInstance(): Promise<RabbitMQService> {
    if (!this.instance) {
      this.instance = await this.create(environment.amqpUrl);
    }

    return this.instance;
  }
}
