import redis from "redis-mock";
import { Queue } from "bullmq";
import request from "supertest";

import app from "../../../app";

describe("redis service", () => {
  let client: any = undefined;

  beforeAll(() => {
    client = redis.createClient({
      url: "redis://localhost:6379",
    });

    if (client) {
      // init bull queues
      const queues = [
        {
          name: "test-queue-1",
          prefix: "test-queue-1",
        },
        {
          name: "test-queue-2",
          prefix: "test-queue-2",
        },
      ];
      const bullQueues = queues.map((queue: any) => {
        return new Queue(queue.name, {
          redis: {
            port: 6379,
          },
        });
      });
    }
  });

  it("should redis client be defined", () => {
    expect(client).toBeDefined();
  });

  it("should return queues of connection", () => {
    const connectionStr = "redis://localhost:6379";
    request(app).get(`/queue-monitor/${connectionStr}`).expect(200);
  });
});
