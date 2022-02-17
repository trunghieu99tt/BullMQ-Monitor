import { ChangeEvent, memo, useEffect, useState } from "react";

type Props = {
  page: number;
  total: number;
  pageSize: number;
  onChangePage: (page: number) => void;
  onChangePageSize: (pageSize: number) => void;
};

const Pagination = ({
  page,
  total,
  onChangePageSize,
  onChangePage,
  pageSize,
}: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(page);

  const onChangePageSizeOption = (e: ChangeEvent<HTMLSelectElement>) => {
    onChangePageSize(parseInt(e.target.value, 10));
  };

  const onChangeGoToPage = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(parseInt(e.target.value, 10));
  };

  const onChangePageNavigation = (newValue: number) => {
    onChangePage(newValue);
  };

  const onGoToPage = () => {
    onChangePage(currentPage);
  };

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  useEffect(() => {
    console.log("Pagination re-rendered");
  });

  const pageCount = Math.ceil(total / pageSize);
  const shouldDisablePrevAndFirst = page === 1;
  const shouldDisableNextAndLast = page === pageCount;

  return (
    <div>
      <div>
        <button
          disabled={shouldDisablePrevAndFirst}
          onClick={() => onChangePageNavigation(1)}
        >
          {"<<"}{" "}
        </button>
        <button
          disabled={shouldDisablePrevAndFirst}
          onClick={() => onChangePageNavigation(Math.max(1, page - 1))}
        >
          {"<"}{" "}
        </button>
        <button
          disabled={shouldDisableNextAndLast}
          onClick={() => onChangePageNavigation(Math.min(pageCount, page + 1))}
        >
          {">"}{" "}
        </button>
        <button
          disabled={shouldDisableNextAndLast}
          onClick={() => onChangePageNavigation(pageCount)}
        >
          {">>"}{" "}
        </button>
        <input
          type="number"
          min={1}
          max={pageCount}
          value={currentPage}
          onChange={onChangeGoToPage}
        />
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
