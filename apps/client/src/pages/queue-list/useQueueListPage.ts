import { useEffect, useState } from "react";
import { useQueue } from "../../talons/useQueue";
import { IRedisInfo } from "../../types/model.type";

export const useQueueListPage = () => {
  const { getQueues, getRedisDetail } = useQueue();

  const [queues, setQueues] = useState([]);
  const [redisDetail, setRedisDetail] = useState<IRedisInfo | null>(null);

  useEffect(() => {
    Promise.all([fetchQueues(), fetchRedisDetail()]);
  }, []);

  const fetchQueues = async () => {
    const data = await getQueues();
    setQueues(data);
  };

  const fetchRedisDetail = async () => {
    const data = await getRedisDetail();
    setRedisDetail(data);
  };

  return {
    queues,
    redisDetail,
  };
};
