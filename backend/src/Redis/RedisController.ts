import { createClient, RedisClientType } from "redis";

export interface MessageToEngine {
  code: string;
  language: string;
}

export class RedisController {
  private client: RedisClientType;
  private publisher: RedisClientType;
  private static instance: RedisController;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    this.client.connect().catch((err) => {
      console.error("Redis connection error:", err);
    });

    this.publisher = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    this.publisher.connect().catch((err) => {
      console.error("Redis connection error:", err);
    });
  }

  public static getInstance(): RedisController {
    if (!RedisController.instance) {
      RedisController.instance = new RedisController();
    }
    return RedisController.instance;
  }

  public sendAndAwait(message: MessageToEngine): Promise<any> {
    return new Promise((resolve) => {
      const id = this.getRandomClientId();

      this.client.subscribe(id, (message) => {
        this.client.unsubscribe(id);
        resolve(JSON.parse(message));
      });

      this.publisher.lPush(
        "messages",
        JSON.stringify({ clientId: id, message })
      );
    });
  }

  public getRandomClientId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
