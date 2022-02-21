import { useState } from "react";
import { useRecoilValue } from "recoil";
import { redisState } from "../../states/redis.state";

export const useHeader = () => {
  const redis = useRecoilValue(redisState);

  const [showRedisInfo, setShowRedisInfo] = useState<boolean>(false);

  const toggleShowRedisInfo = () => setShowRedisInfo((v) => !v);

  return {
    redis,
    showRedisInfo,
    toggleShowRedisInfo,
  };
};
