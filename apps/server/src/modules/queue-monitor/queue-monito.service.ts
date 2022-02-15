import { Job, JobType, Queue } from "bullmq";
import { plainToClass } from "class-transformer";
import { Service } from "typedi";
import redisInfo from "redis-info";
import { NotFoundError } from "routing-controllers";

import { GetQueuesOutputDto } from "./dtos/get-queues-output.dto";

@Service()
export class QueueMonitorService {
  queues: Queue[] = [];

  constructor() {}

  registerQueue(queue: Queue) {
    this.queues.push(queue);
  }

  setQueues(queues: Queue[]) {
    this.queues = queues;
  }

  getQueue(queueName: string): Queue {
    const queue = this.queues.find((queue: Queue) => queue.name === queueName);
    if (!queue) {
      throw new NotFoundError(`Queue ${queueName} not found`);
    }

    return queue;
  }

  async getJob(queueName: string, jobId: string): Promise<Job> {
    const queue = this.getQueue(queueName);
    const job = await queue.getJob(jobId + "");
    if (!job) {
      throw new NotFoundError(`Job ${jobId} not found`);
    }

    return job;
  }

  async getQueues(): Promise<GetQueuesOutputDto[]> {
    return Promise.all(
      this.queues.map(async (queue: Queue) => {
        const numberOfJobs = await queue.getJobCounts();
        return plainToClass(GetQueuesOutputDto, {
          name: queue.name,
          numberOfJobs,
          isPaused: queue.isPaused(),
        });
      })
    );
  }

  async getRedisInfo(): Promise<any> {
    if (this.queues.length > 0) {
      const firstQueue = this.queues[0];
      const client = await firstQueue.client;
      const rawInfo = await client.info();
      return redisInfo.parse(rawInfo);
    }
  }

  async getJobCounts(queueName: string): Promise<any> {
    const queue = this.getQueue(queueName);
    return queue.getJobCounts(
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed",
      "paused"
    );
  }

  async getJobsByType(
    queueName: string,
    type: JobType,
    page: number,
    pageSize: number
  ): Promise<any> {
    const queue = this.getQueue(queueName);
    const numberOfJobs = await queue.getJobCountByTypes(type);
    const totalPages = Math.ceil(numberOfJobs / pageSize);
    if (page > totalPages) {
      page = totalPages;
    }
    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, numberOfJobs);

    return queue.getJobs(type, start, end);
  }

  async getJobDetail(queueName: string, jobId: string): Promise<Job> {
    return this.getJob(queueName, jobId);
  }

  async removeJob(queueName: string, jobId: string): Promise<void> {
    const job = await this.getJob(queueName, jobId);
    await job.remove();
  }

  async retryJob(queueName: string, jobId: string): Promise<void> {
    const job = await this.getJob(queueName, jobId);
    await job.retry();
  }

  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.pause();
  }

  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.resume();
  }
}
