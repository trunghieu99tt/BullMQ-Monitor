import Redis from "ioredis";
import { Service } from "typedi";
import { JobStatus } from "bull";
import { Job, Queue } from "bullmq";
import redisInfo from "redis-info";
import { plainToClass } from "class-transformer";
import { NotFoundError } from "routing-controllers";

// utils
import { ObjectTool } from "../../common/tools/object.tool";

// dtos
import { GetQueuesOutputDto } from "./dtos/get-queues-output.dto";
import { GetJobListOutput } from "./dtos/get-job-list-output.dto";
import { CheckConnectionInput } from "../redis/dtos/check-connection-input.dto";

@Service()
export class QueueMonitorService {
  queues: Queue[] = [];
  connectionQueue: {
    [key: string]: Queue[];
  } = {};

  constructor() {}

  async getQueueListInConnection(input: CheckConnectionInput) {
    const redisClient = new Redis({
      host: input.host,
      port: input.port,
      ...(input.password && { password: input.password }),
      ...(input.username && { username: input.username }),
    });

    const queueNameRegExp = new RegExp("(.*):(.*):id");
    const keys = await redisClient.keys("*:*:id");
    const rawQueues = keys.map(function (key) {
      var match = queueNameRegExp.exec(key);
      if (match) {
        return {
          prefix: match[1],
          name: match[2],
        };
      }
    });

    const queues: Queue[] = [];
    for (const rawQueue of rawQueues) {
      if (rawQueue?.name) {
        queues.push(
          new Queue(rawQueue.name, {
            connection: {
              host: input.host,
              port: input.port,
            },
          })
        );
      }
    }

    if (queues) {
      this.connectionQueue[`${input.host}:${input.port}`] = queues;
    }
  }

  getQueue(connectionStr: string, queueName: string): Queue {
    const queues = this.connectionQueue[connectionStr];
    if (!queues) {
      throw new NotFoundError(`Queue of ${connectionStr} not found`);
    }
    const queue = queues.find((queue: Queue) => queue.name === queueName);
    if (!queue) {
      throw new NotFoundError(`Queue ${queueName} not found`);
    }
    return queue;
  }

  async getJob(
    connectionStr: string,
    queueName: string,
    jobId: string
  ): Promise<Job> {
    const queue = this.getQueue(connectionStr, queueName);
    const job = await queue.getJob(jobId + "");
    if (!job) {
      throw new NotFoundError(`Job ${jobId} not found`);
    }

    return job;
  }

  async getQueuesOfConnection(
    connectionStr: string
  ): Promise<GetQueuesOutputDto[]> {
    let queues = this.connectionQueue[connectionStr];

    if (!queues) {
      const [host, port] = connectionStr.split(":");
      await this.getQueueListInConnection({
        host,
        port: parseInt(port),
      });

      queues = this.connectionQueue[connectionStr];
    }

    return Promise.all(
      queues.map(async (queue: Queue) => {
        const jobs = await queue.getJobCounts();
        return plainToClass(GetQueuesOutputDto, {
          name: queue.name,
          ...jobs,
          isPaused: queue.isPaused(),
        });
      })
    );
  }

  async getRedisInfo(): Promise<any> {
    if (this.queues?.length > 0) {
      const firstQueue = this.queues[0];
      const client = await firstQueue.client;
      const rawInfo = await client.info();
      return redisInfo.parse(rawInfo);
    }
  }

  async getJobCounts(connectionStr: string, queueName: string): Promise<any> {
    const queue = this.getQueue(connectionStr, queueName);
    return queue.getJobCounts(
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed",
      "paused"
    );
  }

  async getJobsByTypes(
    connectionStr: string,
    queueName: string,
    types: string,
    page: number,
    pageSize: number
  ): Promise<{
    data: GetJobListOutput[];
    meta: {
      total: number;
      page: number;
    };
  }> {
    try {
      const queue = this.getQueue(connectionStr, queueName);
      if (queue) {
        let jobTypes: JobStatus[] = [];
        if (types === "*") {
          jobTypes = ["waiting", "active", "completed", "failed", "delayed"];
        } else {
          jobTypes = types
            .split(",")
            .map((type: string) => type.trim()) as JobStatus[];
        }
        const numberOfJobs = await queue.getJobCountByTypes(...jobTypes);
        const totalPages = Math.ceil(numberOfJobs / pageSize);
        if (page > totalPages) {
          page = totalPages;
        }
        const start = (page - 1) * pageSize;
        const end = Math.min(start + pageSize - 1, numberOfJobs);

        const jobs = await queue.getJobs(jobTypes, start, end);
        const data = jobs.map((job: Job) => {
          const data = job.data;
          return plainToClass(GetJobListOutput, {
            ...ObjectTool.omit(job, ["queue", "data", "opts"]),
            data: JSON.stringify(data),
            ...job.opts,
          });
        });

        return {
          data,
          meta: {
            total: numberOfJobs,
            page,
          },
        };
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }

    throw new NotFoundError(`Queue ${queueName} not found`);
  }

  async getJobDetail(
    connectionStr: string,
    queueName: string,
    jobId: string
  ): Promise<Job> {
    return this.getJob(connectionStr, queueName, jobId);
  }

  async removeJob(
    connectionStr: string,
    queueName: string,
    jobId: string
  ): Promise<boolean> {
    try {
      const job = await this.getJob(connectionStr, queueName, jobId);
      await job.remove();
      return true;
    } catch (error) {
      console.error(`Error: ${error}`);
      return false;
    }
  }

  async retryJob(
    connectionStr: string,
    queueName: string,
    jobId: string
  ): Promise<void> {
    const job = await this.getJob(connectionStr, queueName, jobId);
    await job.retry();
  }

  async pauseQueue(connectionStr: string, queueName: string): Promise<void> {
    const queue = this.getQueue(connectionStr, queueName);
    await queue.pause();
  }

  async resumeQueue(connectionStr: string, queueName: string): Promise<void> {
    const queue = this.getQueue(connectionStr, queueName);
    await queue.resume();
  }

  async updateJob(
    connectionStr: string,
    queueName: string,
    jobId: string,
    data: any
  ): Promise<void> {
    const job = await this.getJob(connectionStr, queueName, jobId);
    await job.update(data);
  }
}
