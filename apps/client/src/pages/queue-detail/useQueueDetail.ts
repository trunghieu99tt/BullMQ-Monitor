import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useQueue } from "../../talons/useQueue";

export const useQueueDetail = () => {
  const { queueName } = useParams();
  const { getQueueJobs } = useQueue();

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

  const typeSelectRef = useRef<HTMLSelectElement>(null);

  const fetchQueueJob = useCallback(async () => {
    if (queueName) {
      const { data, meta } = await getQueueJobs(
        queueName,
        types,
        page,
        pageSize
      );
      setData(data);
      setMeta(meta);
    }
  }, [queueName, types, page, pageSize]);

  useEffect(() => {
    fetchQueueJob();
  }, [page, pageSize, types]);

  const toggleActiveJobData = (id: string) => {
    if (activeIds.includes(id)) {
      setActiveIds(activeIds.filter((item) => item !== id));
    } else {
      setActiveIds([...activeIds, id]);
    }
  };

  const onChangePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
  }, []);

  const onChangePage = useCallback((page: number) => {
    setPage(page);
  }, []);

  const onFilter = useCallback(() => {
    const selectedOptions =
      (typeSelectRef?.current?.selectedOptions &&
        Array.from(
          typeSelectRef.current?.selectedOptions,
          (optionEl) => optionEl.value
        )) ||
      [];
    setTypes(selectedOptions);
  }, []);

  return {
    data,
    page,
    meta,
    types,
    pageSize,
    activeIds,
    queueName,
    typeSelectRef,

    onFilter,
    setPage,
    setTypes,
    setPageSize,
    onChangePage,
    onChangePageSize,
    toggleActiveJobData,
  };
};
