import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { APP_PORT } from "./config/env";
import app from "./app";
import { initializeQueues } from "./initQueue";
import { QueueMonitorController } from "./modules/queue-monitor/queue-monitor.controller";

app.listen(APP_PORT, () => {
  initializeQueues();
  console.log("server is running on port " + APP_PORT);
});
