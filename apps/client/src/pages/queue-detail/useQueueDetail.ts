import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQueue } from "../../talons/useQueue";

export const useQueueDetail = () => {
  const { queueName } = useParams();
  const { getQueueJobs, deleteJob } = useQueue();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [types, setTypes] = useState<string[]>(["*"]);
  const [pageSize, setPageSize] = useState<number>(20);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [meta, setMeta] = useState<{
    total: number;
    page: number;
  }>({
    total: 0,
    page: 1,
  });

  useEffect(() => {
    fetchQueueJob(queueName);
  }, [queueName]);

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
        const totalPages = Math.ceil(meta.total / pageSize);
        console.log("totalPages", totalPages);
        if (page > totalPages && totalPages > 0) {
          setPage(totalPages);
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

  const onChangePageSize = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      fetchQueueJob(queueName, types, page, newPageSize);
    },
    [queueName, page, types]
  );

  const onChangePage = useCallback(
    (newPage: number) => {
      if (newPage !== page) {
        setPage(newPage);
        fetchQueueJob(queueName, types, newPage, pageSize);
      }
    },
    [queueName, page, types, pageSize]
  );

  const toggleType = useCallback(
    (type: string, shouldIgnoreAll = false) => {
      let newTypes = [...types];
      if (types.includes(type)) {
        newTypes = newTypes.filter((item) => item !== type);
      } else {
        newTypes.push(type);
      }

      setTypes(newTypes);
      fetchQueueJob(queueName, newTypes, page, pageSize);
    },
    [queueName, page, types, pageSize]
  );

  const removeJob = useCallback(
    async (jobId: string) => {
      if (queueName) {
        const isDeleteOk = await deleteJob(queueName, jobId);
        if (isDeleteOk) {
          setPage(1);
          fetchQueueJob(queueName, types, 1, pageSize);
        }
      }
    },
    [queueName]
  );

  return {
    data,
    page,
    meta,
    types,
    pageSize,
    activeIds,
    queueName,

    setPage,
    removeJob,
    setTypes,
    toggleType,
    setPageSize,
    onChangePage,
    onChangePageSize,
    toggleActiveJobData,
  };
};
