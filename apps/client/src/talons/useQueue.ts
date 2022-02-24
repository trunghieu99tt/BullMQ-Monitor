import client from "../api/client";

// models
import { Job } from "../models/job";
import { Redis } from "../models/redis";

// types
import { LIST_META } from "../types/common.types";
import { IJob, IRedisInfo } from "../types/model.type";

const BASE_BULL_MONITOR_URL = "/queue-monitor";

type Props = {
  connectionStr: string;
  queueName: string;
};

export const useQueue = ({ connectionStr, queueName }: Props) => {
  const getQueues = async () => {
    const response = await client.get(
      `${BASE_BULL_MONITOR_URL}/${connectionStr}`
    );
    return response?.data;
  };

  const getQueueJobs = async (
    types: string[],
    page = 1,
    pageSize = 20
  ): Promise<{
    data: IJob[];
    meta: LIST_META;
  }> => {
    console.log("client", client.defaults.baseURL);

    const response = await client.post(`${BASE_BULL_MONITOR_URL}/job-list`, {
      connectionStr,
      queueName,
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

  const deleteJob = async (jobId: string): Promise<boolean> => {
    const response = await client.delete(
      `${BASE_BULL_MONITOR_URL}/${connectionStr}/${queueName}/${jobId}`
    );
    return response?.status === 200;
  };

  const updateJob = async (jobId: string, data: any): Promise<IJob> => {
    const response = await client.post(`${BASE_BULL_MONITOR_URL}/update-job`, {
      connectionStr,
      queueName,
      jobId,
      data,
    });

    return new Job(response?.data).getData();
  };

  const getJobCounts = async () => {
    const response = await client.post(`${BASE_BULL_MONITOR_URL}/count`, {
      connectionStr,
      queueName,
    });
    return response?.data;
  };

  const retryJob = async (jobId: string) => {
    const response = await client.post(`${BASE_BULL_MONITOR_URL}/retry`, {
      connectionStr,
      queueName,
      jobId,
    });

    console.log("response", response);

    return response?.data;
  };

  return {
    getQueues,
    deleteJob,
    updateJob,
    retryJob,
    getJobCounts,
    getQueueJobs,
    getRedisDetail,
  };
};
