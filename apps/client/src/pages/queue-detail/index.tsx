import React from "react";
import { JOB_TYPES } from "../../constants";
import { useQueueDetail } from "./useQueueDetail";

import classes from "./queue-detail.module.css";
import Pagination from "../../components/Pagination";

const QueueDetail = () => {
  const {
    data,
    meta,
    page,
    types,
    activeIds,
    queueName,
    typeSelectRef,

    onFilter,
    onChangePage,
    onChangePageSize,
    toggleActiveJobData,
  } = useQueueDetail();

  return (
    <section className={classes.root}>
      <div></div>
      <header>
        <h1>Queue {queueName}</h1>
        <select multiple ref={typeSelectRef}>
          <option value="*">All</option>
          {JOB_TYPES.map((type: string, idx: number) => {
            return (
              <option value={type} key={`${type}-${idx}`}>
                {type}
              </option>
            );
          })}
        </select>
        <button onClick={onFilter}>Filter</button>
      </header>
      <main>
        <table className={classes.table}>
          <thead className={classes.thead}>
            <tr>
              <th
                style={{
                  width: "50px",
                }}
              ></th>
              <th>ID</th>
              <th>Status</th>
              <th>Name</th>
              <th>Timestamp</th>
              <th>Delay</th>
              <th>Attempt</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((job: any, idx: number) => {
              return (
                <React.Fragment>
                  <tr key={`${job.id}`}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{job.id}</td>
                    <td>{job.status}</td>
                    <td>{job.name}</td>
                    <td>{job.timestamp}</td>
                    <td>{job.delay}</td>
                    <td>{job.attempt}</td>
                    <td>
                      <button onClick={() => toggleActiveJobData(job.id)}>
                        Detail
                      </button>
                      <button>Edit</button>
                      <button>Delete</button>
                    </td>
                  </tr>
                  {activeIds?.includes(job.id) && (
                    <tr>
                      <td colSpan={100}>
                        <div className={classes.jobDetailData}>{job.data}</div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot className={classes.tfoot}>
            <Pagination
              page={page}
              total={meta?.total || 0}
              onChangePage={onChangePage}
              onChangePageSize={onChangePageSize}
            />
          </tfoot>
        </table>
      </main>
    </section>
  );
};

export default QueueDetail;
