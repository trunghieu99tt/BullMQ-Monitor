import { Job, Queue } from "bullmq";
import { plainToClass } from "class-transformer";
import { Service } from "typedi";
import redisInfo from "redis-info";
import { NotFoundError } from "routing-controllers";

import { GetQueuesOutputDto } from "./dtos/get-queues-output.dto";
import { JobStatus } from "bull";
import { GetJobListOutput } from "./dtos/get-job-list-output.dto";
import { ObjectTool } from "../../common/tools/object.tool";

import { LruCache } from "utils";

@Service()
export class QueueMonitorService {
  queues: Queue[] = [];
  cache = new LruCache<any>();

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

  async getJobsByTypes(
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
      const queue = this.getQueue(queueName);
      if (queue) {
        let jobTypes: JobStatus[] = [];
        if (types === "*") {
          jobTypes = ["waiting", "active", "completed", "failed", "delayed"];
        } else {
          jobTypes = types
            .split(",")
            .map((type: string) => type.trim()) as JobStatus[];
        }
        console.log("jobTypes", jobTypes);
        const numberOfJobs = await queue.getJobCountByTypes(...jobTypes);
        const totalPages = Math.ceil(numberOfJobs / pageSize);
        if (page > totalPages) {
          page = totalPages;
        }
        const start = (page - 1) * pageSize;
        const end = Math.min(start + pageSize, numberOfJobs);

        console.log("queue", queue.name);
        const jobs = await queue.getJobs(jobTypes, start, end);
        console.log("jobs", jobs);

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

  async getJobDetail(queueName: string, jobId: string): Promise<Job> {
    return this.getJob(queueName, jobId);
  }

  async removeJob(queueName: string, jobId: string): Promise<boolean> {
    try {
      const job = await this.getJob(queueName, jobId);
      await job.remove();
      return true;
    } catch (error) {
      console.error(`Error: ${error}`);
      return false;
    }
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

  async updateJob(queueName: string, jobId: string, data: any): Promise<void> {
    const job = await this.getJob(queueName, jobId);
    await job.update(data);
  }
}
