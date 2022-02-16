import React from "react";
import { JOB_TYPES } from "../../constants";
import { useQueueDetail } from "./useQueueDetail";

const QueueDetail = () => {
  const {
    data,
    page,
    pageSize,
    setPage,
    setPageSize,
    setTypes,
    types,
    queueName,
  } = useQueueDetail();

  console.log("data", data);

  return (
    <section>
      <div></div>
      <header>
        <h1>Queue {queueName}</h1>
        <select multiple>
          <option value="*">All</option>
          {JOB_TYPES.map((type: string, idx: number) => {
            return (
              <option value={type} key={`${type}-${idx}`}>
                {type}
              </option>
            );
          })}
        </select>
      </header>
      <main>
        <table>
          <thead>
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
                      <button>Edit</button>
                      <button>Detail</button>
                      <button>Delete</button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={8}>
                      <code lang="cpp">
                        <span>Cout</span>
                      </code>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot></tfoot>
        </table>
      </main>
    </section>
  );
};

export default QueueDetail;
