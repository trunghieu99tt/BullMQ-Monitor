import client from "../api/client";

export const useQueue = () => {
  const getQueues = async () => {
    const response = await client.get("");
    return response?.data;
  };

  const getQueueJobs = async (
    queue: string,
    types: string[],
    page = 1,
    pageSize = 20
  ) => {
    const response = await client.post(`job-list`, {
      queueName: queue,
      jobTypes: types.join(","),
      page,
      pageSize,
    });

    return response?.data;
  };

  return {
    getQueues,
    getQueueJobs,
  };
};
