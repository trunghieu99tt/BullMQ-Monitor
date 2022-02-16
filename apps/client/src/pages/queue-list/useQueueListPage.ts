import { useEffect, useState } from "react";
import { useQueue } from "../../talons/useQueue";

export const useQueueListPage = () => {
  const { getQueues } = useQueue();

  const [queues, setQueues] = useState([]);

  useEffect(() => {
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    const data = await getQueues();
    setQueues(data);
  };

  return {
    queues,
  };
};
