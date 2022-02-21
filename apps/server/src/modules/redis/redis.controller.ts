import { Body, Controller, JsonController, Post } from "routing-controllers";
import Container, { Service } from "typedi";
import { CheckConnectionInput } from "./dtos/check-connection-input.dto";
import { RedisService } from "./redis.service";

@Controller("connection")
@JsonController("/connection")
@Service()
export class RedisController {
  constructor(private readonly redisService: RedisService) {
    this.redisService = Container.get(RedisService);
  }

  @Post("/check-connection")
  async checkRedisConnection(@Body() input: CheckConnectionInput): Promise<{
    connected: boolean;
  }> {
    return this.redisService.checkRedisConnection(input);
  }

  @Post("/redis-info")
  async getRedisInfo(@Body() input: CheckConnectionInput) {
    return this.redisService.getRedisInfo(input);
  }
}
