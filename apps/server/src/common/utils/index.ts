import { Queue, RedisClient } from "bullmq";

export const initQueue = (queueName: string, redisClient: RedisClient) => {
  return new Queue(queueName, {
    connection: redisClient,
  });
};
