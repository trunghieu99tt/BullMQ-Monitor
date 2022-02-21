import { createExpressServer, useContainer } from "routing-controllers";
import Container from "typedi";
import { QueueMonitorController } from "./modules/queue-monitor/queue-monitor.controller";
import { RedisController } from "./modules/redis/redis.controller";

useContainer(Container);

const app = createExpressServer({
  controllers: [QueueMonitorController, RedisController],
  cors: true,
});

export default app;
