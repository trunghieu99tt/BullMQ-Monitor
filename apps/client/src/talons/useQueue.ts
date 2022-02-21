import client from "../api/client";
import { Job } from "../models/job";
import { Redis } from "../models/redis";
import { LIST_META } from "../types/common.types";
import { IJob, IRedisInfo } from "../types/model.type";

const BASE_BULL_MONITOR_URL = "/queue-monitor";

type Props = {
  connectionStr: string;
};

export const useQueue = ({ connectionStr }: Props) => {
  const getQueues = async () => {
    const response = await client.get(
      `${BASE_BULL_MONITOR_URL}/${connectionStr}`
    );
    return response?.data;
  };

  const getQueueJobs = async (
    queue: string,
    types: string[],
    page = 1,
    pageSize = 20
  ): Promise<{
    data: IJob[];
    meta: LIST_META;
  }> => {
    const response = await client.post(`${BASE_BULL_MONITOR_URL}/job-list`, {
      connectionStr,
      queueName: queue,
      jobTypes: types.join(","),
      page,
      pageSize,
    });

    const jobs = response?.data?.data?.map((rawData: any) => {
      return new Job(rawData).getData();
    });

    return {
      data: jobs,
      meta: response?.data?.meta,
    };
  };

  const getRedisDetail = async (): Promise<IRedisInfo> => {
    const response = await client.get("/redis");
    const redisInfo = new Redis(response?.data);
    return redisInfo.getData();
  };

  const deleteJob = async (
    queueName: string,
    jobId: string
  ): Promise<boolean> => {
    const response = await client.delete(
      `${BASE_BULL_MONITOR_URL}/${connectionStr}/${queueName}/${jobId}`
    );
    return response?.status === 200;
  };

  const updateJob = async (
    queueName: string,
    jobId: string,
    data: any
  ): Promise<IJob> => {
    const response = await client.post(`${BASE_BULL_MONITOR_URL}/update-job`, {
      connectionStr,
      queueName,
      jobId,
      data,
    });

    return new Job(response?.data).getData();
  };

  return {
    getQueues,
    deleteJob,
    updateJob,
    getQueueJobs,
    getRedisDetail,
  };
};
