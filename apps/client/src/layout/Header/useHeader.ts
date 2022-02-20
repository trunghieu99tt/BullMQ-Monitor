import { useEffect, useState } from "react";
import { useQueue } from "../../talons/useQueue";
import { IRedisInfo } from "../../types/model.type";

export const useHeader = () => {
  const [redis, setRedis] = useState<IRedisInfo | null>(null);
  const [showRedisInfo, setShowRedisInfo] = useState<boolean>(false);

  const { getRedisDetail } = useQueue();

  useEffect(() => {
    fetchRedisInfo();
  }, []);

  const fetchRedisInfo = async (): Promise<void> => {
    const data = await getRedisDetail();
    setRedis(data);
  };

  const toggleShowRedisInfo = () => setShowRedisInfo((v) => !v);

  return {
    redis,
    showRedisInfo,
    toggleShowRedisInfo,
  };
};
