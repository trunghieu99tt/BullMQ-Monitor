import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { connectionSelectorByConnectionId } from "../../states/connection.state";
import { redisState } from "../../states/redis.state";
import { useQueue } from "../../talons/useQueue";
import { IJob } from "../../types/model.type";

export const useQueueDetail = () => {
  const { queueName, connectionId } = useParams();
  const connection = useRecoilValue(
    connectionSelectorByConnectionId(connectionId)
  );
  const setRedis = useSetRecoilState(redisState);

  const { getQueueJobs, deleteJob, updateJob } = useQueue({
    connectionStr: `${connection?.host}:${connection?.port}`,
  });

  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(20);
  const [types, setTypes] = useState<string[]>(["*"]);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [meta, setMeta] = useState<{
    total: number;
    page: number;
  }>({
    total: 0,
    page: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<IJob | null>(null);
  const [updatedJobData, setUpdatedJobData] = useState<any>({});

  useEffect(() => {
    fetchQueueJob(queueName);
  }, [queueName]);

  useEffect(() => {
    if (connection?.info) {
      setRedis(connection?.info);
    }
  }, [connection]);

  const fetchQueueJob = useCallback(
    async (queueName = "", types = ["*"], page = 1, pageSize = 20) => {
      if (queueName) {
        const { data, meta } = await getQueueJobs(
          queueName,
          types,
          page,
          pageSize
        );
        setData(data);
        setMeta(meta);
        const totalPages = Math.ceil(meta.total / currentPageSize);
        console.log("totalPages", totalPages);
        if (page > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
      }
    },
    []
  );

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
      fetchQueueJob(queueName, types, page, pageSize);
    }
  };

  const toggleType = useCallback(
    (type: string, shouldIgnoreAll = false) => {
      let newTypes = [...types];
      if (types.includes(type)) {
        newTypes = newTypes.filter((item) => item !== type);
      } else {
        newTypes.push(type);
      }

      setTypes(newTypes);
      fetchQueueJob(queueName, newTypes, currentPage, currentPageSize);
    },
    [queueName, currentPage, types, currentPageSize]
  );

  const removeJob = useCallback(
    async (jobId: string) => {
      if (queueName) {
        const isDeleteOk = await deleteJob(queueName, jobId);
        if (isDeleteOk) {
          setCurrentPage(1);
          fetchQueueJob(queueName, types, 1, currentPageSize);
        }
      }
    },
    [queueName]
  );

  const updateJobData = useCallback(
    (queueName: string, jobId: string, newJobData: any) => {
      updateJob(queueName, jobId, newJobData);
    },
    []
  );

  const onChangeJobData = (data: any) => {
    setUpdatedJobData(data);
  };

  const onCancelEdit = () => {
    setEditingJob(null);
    setUpdatedJobData({});
  };

  return {
    data,
    meta,
    types,
    activeIds,
    queueName,
    editingJob,
    currentPage,
    currentPageSize,
    updatedJobData,

    setTypes,
    removeJob,
    toggleType,
    onCancelEdit,
    setEditingJob,
    updateJobData,
    onChangeJobData,
    onChangePagination,
    toggleActiveJobData,
  };
};