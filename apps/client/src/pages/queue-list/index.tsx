import { Link } from "react-router-dom";
import { useQueueListPage } from "./useQueueListPage";

const QueueList = () => {
  const { queues } = useQueueListPage();

  return (
    <section>
      QueueList
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Active</th>
              <th>Completed</th>
              <th>Delayed</th>
              <th>Failed</th>
              <th>Paused</th>
              <th>Waiting</th>
              <th>Is Running</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {queues.map((queue: any, idx: number) => {
              return (
                <tr key={`${queue.name}-${idx}`}>
                  <td>{queue.name}</td>
                  <td>{queue.active}</td>
                  <td>{queue.completed}</td>
                  <td>{queue.delayed}</td>
                  <td>{queue.failed}</td>
                  <td>{queue.paused}</td>
                  <td>{queue.waiting}</td>
                  <td>{queue.isPaused ? "No" : "Yes"}</td>
                  <button>
                    <Link to={`/${queue.name}`}>Detail</Link>
                  </button>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default QueueList;
