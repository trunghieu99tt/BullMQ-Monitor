import { useRecoilValue } from "recoil";
import { redisState } from "../../states/redis.state";

export const useHeader = () => {
  const redis = useRecoilValue(redisState);

  return {
    redis,
  };
};
