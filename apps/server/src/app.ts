import { createExpressServer, useContainer } from "routing-controllers";
import Container from "typedi";
import { QueueMonitorController } from "./modules/queue-monitor/queue-monitor.controller";

useContainer(Container);

const app = createExpressServer({
  controllers: [QueueMonitorController],
  cors: true,
});

export default app;
