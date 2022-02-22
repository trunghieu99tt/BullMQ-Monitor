import redis from "redis-mock";
import { RedisService } from "../../../modules/redis/redis.service";
jest.mock("redis", () => redis);

describe("redisService", () => {
  beforeAll(() => {
    jest.resetModules();
    // init redis service
  });

  it("should be defined", () => {
    const redisService = new RedisService();
    expect(redisService).toBeDefined();
  });
});
