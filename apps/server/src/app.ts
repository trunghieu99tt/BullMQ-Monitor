import Container from "typedi";
import { createExpressServer, useContainer } from "routing-controllers";

// controllers
import { RedisController } from "./modules/redis/redis.controller";
import { QueueMonitorController } from "./modules/queue-monitor/queue-monitor.controller";

useContainer(Container);

const app = createExpressServer({
  controllers: [QueueMonitorController, RedisController],
  cors: true,
});

export default app;
