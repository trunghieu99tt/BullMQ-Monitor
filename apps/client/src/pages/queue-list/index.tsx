import { Button, Table } from "antd";
import { Link } from "react-router-dom";
import { IJob } from "../../types/model.type";
import { useQueueListPage } from "./useQueueListPage";

import classes from "./queue-list.module.css";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Active",
    dataIndex: "active",
  },
  {
    title: "Completed",
    dataIndex: "completed",
  },
  {
    title: "Delayed",
    dataIndex: "delayed",
  },
  {
    title: "Failed",
    dataIndex: "failed",
  },
  {
    title: "Paused",
    dataIndex: "paused",
  },
  {
    title: "Waiting",
    dataIndex: "waiting",
  },
  {
    title: "Is Running",
    dataIndex: "isPaused",
    render: (isPaused: boolean) => {
      return <span>{isPaused ? "No" : "Yes"}</span>;
    },
  },
  {
    title: "Actions",
    dataIndex: "actions",
    render: (_: any, record: IJob) => {
      return (
        <Button type="primary" shape="round">
          <Link to={`/${record.name}`}>Detail</Link>
        </Button>
      );
    },
  },
];

const QueueList = () => {
  const { queues } = useQueueListPage();

  return (
    <main className={classes.main}>
      <Table
        title={() => "Queue List"}
        columns={columns}
        dataSource={queues}
        size="middle"
        pagination={false}
      />
    </main>
  );
};

export default QueueList;
