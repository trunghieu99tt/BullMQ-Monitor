import Redis from "ioredis";
import { Service } from "typedi";
import redisInfo from "redis-info";

// dtos
import { CheckConnectionInput } from "./dtos/check-connection-input.dto";

// constants
import { TEN_SECONDS } from "../../common/constants";

@Service()
export class RedisService {
  createClient(input: CheckConnectionInput): Redis.Redis {
    return new Redis({
      host: input.host,
      port: input.port,
      ...(input.username && { password: input.username }),
      ...(input.password && { password: input.password }),
    });
  }

  async checkRedisConnection(input: CheckConnectionInput): Promise<{
    connected: boolean;
  }> {
    const redisClient = this.createClient(input);

    let resolveConnection: any = null;
    const timeout = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        reject(new Error("timeout"));
      }, TEN_SECONDS);
    });

    const shouldConnect = new Promise((resolve) => {
      resolveConnection = resolve;
    });

    redisClient.on("connect", () => {
      if (resolveConnection && typeof resolveConnection === "function") {
        resolveConnection();
      }
    });

    try {
      await Promise.race([timeout, shouldConnect]);
    } catch (err) {
      console.error(`${this.checkRedisConnection.name} error:`, err);
      redisClient.quit();
      return {
        connected: false,
      };
    }

    redisClient.quit();
    return {
      connected: true,
    };
  }

  async getRedisInfo(input: CheckConnectionInput): Promise<any> {
    const redisClient = this.createClient(input);
    const rawInfo = await redisClient.info();
    return redisInfo.parse(rawInfo);
  }
}
