import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisPubSubService {
  private client: RedisClientType;

  constructor() {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT, 10) || 6379;

    this.client = createClient({
      socket: {
        host: redisHost,
        port: redisPort,
      },
    });
    this.client.connect();
  }

  async publish(channel: string, message: string) {
    await this.client.publish(channel, message);
  }

  async subscribe(channel: string, listener: (message: string) => void) {
    this.client.on('message', (chan, msg) => {
      if (chan === channel) {
        listener(msg);
      }
    });
    await this.client.subscribe(channel, () => {});
  }
}
