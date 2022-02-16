import { ChangeEvent, memo, useEffect, useRef, useState } from "react";

type Props = {
  page: number;
  total: number;
  onChangePage: (page: number) => void;
  onChangePageSize: (pageSize: number) => void;
};

const Pagination = ({ page, total, onChangePageSize, onChangePage }: Props) => {
  const [pageSize, setPageSize] = useState<number>(20);
  const pageNumberRef = useRef<HTMLInputElement>(null);

  const onChangePageSizeOption = (e: ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value, 10);
    setPageSize(newPageSize);
    onChangePageSize(parseInt(e.target.value));
  };

  const onGoToPage = () => {
    if (pageNumberRef?.current) {
      onChangePage(parseInt(pageNumberRef?.current?.value, 10));
    }
  };

  useEffect(() => {
    if (pageNumberRef?.current) {
      pageNumberRef.current.value = page + "";
    }
  }, [page, total]);

  useEffect(() => {
    if (pageNumberRef?.current) {
      const currentPage = parseInt(pageNumberRef?.current?.value, 10);
      const totalPages = Math.ceil(total / pageSize);
      pageNumberRef.current.value = Math.min(currentPage, totalPages) + "";
    }
  }, [pageSize, total]);

  const pageCount = Math.ceil(total / pageSize);
  const shouldDisablePrevAndFirst = page === 1;
  const shouldDisableNextAndLast = page === pageCount;

  return (
    <div>
      <div>
        <button
          disabled={shouldDisablePrevAndFirst}
          onClick={() => onChangePage(1)}
        >
          {"<<"}{" "}
        </button>
        <button
          disabled={shouldDisablePrevAndFirst}
          onClick={() => onChangePage(Math.max(1, page - 1))}
        >
          {"<"}{" "}
        </button>
        <button
          disabled={shouldDisableNextAndLast}
          onClick={() => onChangePage(Math.min(pageCount, page + 1))}
        >
          {">"}{" "}
        </button>
        <button
          disabled={shouldDisableNextAndLast}
          onClick={() => onChangePage(pageCount)}
        >
          {">>"}{" "}
        </button>
        <input type="number" min={1} max={pageCount} ref={pageNumberRef} />
        <button onClick={onGoToPage}>Go</button>
      </div>
      <select onChange={onChangePageSizeOption}>
        <option value={20}>20</option>
        <option value={30}>30</option>
        <option value={40}>40</option>
      </select>
    </div>
  );
};

export default memo(Pagination);
