import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import { connectionSelectorByConnectionId } from "../../states/connection.state";
import { redisState } from "../../states/redis.state";
import { useQueue } from "../../talons/useQueue";

export const useQueueListPage = () => {
  const { connectionId } = useParams();

  const connection = useRecoilValue(
    connectionSelectorByConnectionId(connectionId)
  );
  const { getQueues } = useQueue({
    connectionStr: `${connection?.host}:${connection?.port}`,
  });
  const [redis, setRedis] = useRecoilState(redisState);

  const [queues, setQueues] = useState([]);

  useEffect(() => {
    fetchQueues();
  }, [connection]);

  useEffect(() => {
    if (connection?.info) {
      setRedis(connection?.info);
    }
  }, [connection]);

  const fetchQueues = async () => {
    const data = await getQueues();
    setQueues(data);
  };

  return {
    connectionId,
    queues,
    redis,
  };
};
