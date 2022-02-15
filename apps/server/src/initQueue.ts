import { Queue } from "bullmq";
import Container from "typedi";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "./config/env";
import { QueueMonitorService } from "./modules/queue-monitor/queue-monito.service";

const QUEUE_NAMES = ["email", "sms", "push"];

export const initializeQueues = () => {
  const queueMonitorService = Container.get(QueueMonitorService);
  const queues = Object.values(QUEUE_NAMES).map((queueName) => {
    return new Queue(queueName, {
      connection: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
      },
    });
  });

  queueMonitorService.setQueues(queues);

  return queues;
};
