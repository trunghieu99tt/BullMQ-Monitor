import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQueue } from "../../talons/useQueue";

export const useQueueDetail = () => {
  const { queueName } = useParams();
  const { getQueueJobs } = useQueue();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [types, setTypes] = useState<string[]>(["*"]);
  const [pageSize, setPageSize] = useState<number>(20);

  const fetchQueueJob = useCallback(async () => {
    if (queueName) {
      const data = await getQueueJobs(queueName, types, page, pageSize);
      setData(data);
    }
  }, [queueName, types, page, pageSize]);

  useEffect(() => {
    fetchQueueJob();
  }, [page, pageSize]);

  return {
    data,
    page,
    types,
    pageSize,
    queueName,
    setTypes,
    setPage,
    setPageSize,
  };
};
