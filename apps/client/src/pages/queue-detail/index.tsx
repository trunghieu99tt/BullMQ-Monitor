import React from "react";
import { JOB_TYPES } from "../../constants";
import { useQueueDetail } from "./useQueueDetail";
import cn from "classnames";

import classes from "./queue-detail.module.css";
import Pagination from "../../components/Pagination";

const QueueDetail = () => {
  const {
    data,
    meta,
    page,
    types,
    pageSize,
    activeIds,
    queueName,

    toggleType,
    onChangePage,
    onChangePageSize,
    toggleActiveJobData,
  } = useQueueDetail();

  return (
    <section className={classes.root}>
      <div></div>
      <header>
        <h1>Queue {queueName}</h1>
        <div>
          {JOB_TYPES.map((type: string, idx: number) => {
            return (
              <button
                value={type}
                key={`${type}-${idx}`}
                onClick={() => toggleType(type)}
                className={cn(classes.typeBtn, {
                  [classes.active]: types.includes(type),
                })}
              >
                {type}
              </button>
            );
          })}
        </div>
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
            {data.map((job: any) => {
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
            {data?.length > 0 && (
              <Pagination
                pageSize={pageSize}
                page={page}
                total={meta?.total || 0}
                onChangePage={onChangePage}
                onChangePageSize={onChangePageSize}
              />
            )}
          </tfoot>
        </table>
      </main>
    </section>
  );
};

export default QueueDetail;
