import { useParams } from "react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useCallback, useEffect, useRef, useState } from "react";

// talons
import { useQueue } from "../../talons/useQueue";

// states
import { redisState } from "../../states/redis.state";
import { connectionSelectorByConnectionId } from "../../states/connection.state";

// models
import { IJob } from "../../types/model.type";
import { LIST_META } from "../../types/common.types";

// constants
import { POLLING_INTERVAL } from "../../constants";

export const useQueueDetail = () => {
  const { queueName, connectionId } = useParams();
  const connection = useRecoilValue(
    connectionSelectorByConnectionId(connectionId)
  );
  const setRedis = useSetRecoilState(redisState);

  let fetchQueueJobIntervalRef = useRef<any>();
  const connectionStr = `${connection?.host}:${connection?.port}`;

  const { getQueueJobs, deleteJob, updateJob, getJobCounts, retryJob } =
    useQueue({
      connectionStr,
      queueName: queueName || "",
    });

  const [data, setData] = useState<any[]>([]);
  const [types, setTypes] = useState<string[]>(["*"]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [updatedJobData, setUpdatedJobData] = useState<any>({});
  const [jobCounts, setJobCounts] = useState<{
    [key: string]: number;
  }>({});
  const [editingJob, setEditingJob] = useState<IJob | null>(null);
  const [currentPageSize, setCurrentPageSize] = useState<number>(20);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [meta, setMeta] = useState<LIST_META>({
    total: 0,
    page: 1,
  });

  useEffect(() => {
    if (connection) {
      fetchData();

      if (fetchQueueJobIntervalRef?.current) {
        clearInterval(fetchQueueJobIntervalRef.current);
      }

      fetchQueueJobIntervalRef.current = setInterval(() => {
        fetchData();
      }, POLLING_INTERVAL);

      if (connection?.info) {
        setRedis(connection?.info);
      }
    }

    return () => {
      if (fetchQueueJobIntervalRef?.current) {
        clearInterval(fetchQueueJobIntervalRef.current);
      }
    };
  }, [
    queueName,
    connectionId,
    connection,
    currentPage,
    currentPageSize,
    types,
  ]);

  const fetchData = useCallback(async () => {
    if (queueName) {
      setLoading(true);
      await Promise.all([fetchJobCount(), fetchQueueJob()]);
      setLoading(false);
    }
  }, [
    connectionStr,
    currentPage,
    currentPageSize,
    types,
    queueName,
    connection,
  ]);

  const fetchJobCount = useCallback(async () => {
    if (queueName) {
      const data = await getJobCounts();
      setJobCounts(data);
    }
  }, [queueName, connectionStr]);

  const fetchQueueJob = useCallback(async () => {
    if (queueName) {
      const { data, meta } = await getQueueJobs(
        types,
        currentPage,
        currentPageSize
      );
      setData(data);
      setMeta(meta);
      const totalPages = Math.ceil(meta.total / currentPageSize);
      console.log("totalPages", totalPages);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    }
  }, [connectionStr, currentPage, currentPageSize, types, queueName]);

  const toggleActiveJobData = (id: string) => {
    if (activeIds.includes(id)) {
      setActiveIds(activeIds.filter((item) => item !== id));
    } else {
      setActiveIds([...activeIds, id]);
    }
  };

  const onChangePagination = (page: number, pageSize: number) => {
    if (page !== currentPage || pageSize !== currentPageSize) {
      if (page !== currentPage) {
        setCurrentPage(page);
      }

      if (currentPage !== pageSize) {
        setCurrentPageSize(pageSize);
      }
      fetchQueueJob();
    }
  };

  const toggleType = useCallback(
    (type: string) => {
      let newTypes = [...types.filter((type) => type !== "*")];
      if (types.includes(type)) {
        newTypes = newTypes.filter((item) => item !== type);
      } else {
        newTypes.push(type);
      }

      if (newTypes.length === 0) {
        newTypes.push("*");
      }

      setTypes(newTypes);
      fetchQueueJob();
    },
    [queueName, currentPage, types, currentPageSize]
  );

  const removeJob = useCallback(
    async (jobId: string) => {
      if (queueName) {
        const isDeleteOk = await deleteJob(jobId);
        if (isDeleteOk) {
          setCurrentPage(1);
          fetchQueueJob();
        }
      }
    },
    [queueName]
  );

  const updateJobData = useCallback((jobId: string, newJobData: any) => {
    updateJob(jobId, newJobData);
  }, []);

  const onChangeJobData = (data: any) => {
    setUpdatedJobData(data);
  };

  const onCancelEdit = () => {
    setEditingJob(null);
    setUpdatedJobData({});
  };

  const onRetryJob = useCallback(
    (jobId: string) => {
      if (queueName) {
        retryJob(jobId);
      }
    },
    [connectionStr, queueName]
  );

  return {
    data,
    meta,
    types,
    loading,
    jobCounts,
    activeIds,
    queueName,
    editingJob,
    currentPage,
    updatedJobData,
    currentPageSize,

    setTypes,
    removeJob,
    onRetryJob,
    toggleType,
    onCancelEdit,
    setEditingJob,
    updateJobData,
    onChangeJobData,
    onChangePagination,
    toggleActiveJobData,
  };
};
