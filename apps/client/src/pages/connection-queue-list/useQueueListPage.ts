import { message } from "antd";
import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

// talons
import { useQueue } from "../../talons/useQueue";

// states
import { redisState } from "../../states/redis.state";
import { connectionSelectorByConnectionId } from "../../states/connection.state";

// constants
import { POLLING_INTERVAL } from "../../constants";

export const useQueueListPage = () => {
  const { connectionId } = useParams();

  const connection = useRecoilValue(
    connectionSelectorByConnectionId(connectionId)
  );

  const [redis, setRedis] = useRecoilState(redisState);

  const { getQueues } = useQueue({
    connectionStr: `${connection?.host}:${connection?.port}`,
    queueName: "",
  });

  const fetchQueueListIntervalRef = useRef<any>();

  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log("connection", connection);
    fetchQueues();

    if (connection?.info) {
      setRedis(connection?.info);
    }

    // if (fetchQueueListIntervalRef?.current) {
    //   clearInterval(fetchQueueListIntervalRef.current);
    // }

    // fetchQueueListIntervalRef.current = setInterval(() => {
    //   fetchQueues();
    // }, POLLING_INTERVAL);

    return () => {
      if (fetchQueueListIntervalRef?.current) {
        clearInterval(fetchQueueListIntervalRef.current);
      }
    };
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
