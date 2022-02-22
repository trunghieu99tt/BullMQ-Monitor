import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import { POLLING_INTERVAL } from "../../constants";
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
  const fetchQueueListIntervalRef = useRef<any>();

  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchQueues();

    if (fetchQueueListIntervalRef?.current) {
      clearInterval(fetchQueueListIntervalRef.current);
    }

    fetchQueueListIntervalRef.current = setInterval(() => {
      fetchQueues();
    }, POLLING_INTERVAL);

    return () => {
      if (fetchQueueListIntervalRef?.current) {
        clearInterval(fetchQueueListIntervalRef.current);
      }
    };
  }, [connection]);

  useEffect(() => {
    if (connection?.info) {
      setRedis(connection?.info);
    }
  }, [connection]);

  const fetchQueues = async () => {
    try {
      setLoading(true);
      const data = await getQueues();
      setLoading(false);
      setQueues(data);
    } catch (error: any) {
      console.error(`${fetchQueues.name} error:`, error);
      message.error(error.message);
    }
  };

  return {
    redis,
    queues,
    loading,
    connectionId,
  };
};
