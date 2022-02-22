import { JOB_TYPES } from "../../constants";
import { useQueueDetail } from "./useQueueDetail";

import classes from "./queue-detail.module.css";
import { Button, Modal, Space, Table } from "antd";
import { IJob } from "../../types/model.type";
import JSONEditor from "../../components/JsonEditor";

const QueueDetail = () => {
  const {
    data,
    meta,
    types,
    queueName,
    editingJob,
    currentPage,
    updatedJobData,
    currentPageSize,

    removeJob,
    toggleType,
    setEditingJob,
    onChangePagination,
    onChangeJobData,
    updateJobData,
    onCancelEdit,
  } = useQueueDetail();

  const onShowDetail = (jobId: string) => {
    const job = data.find((item) => item.id === jobId);
    if (job) {
      Modal.info({
        title: job.id,
        content: (
          <JSONEditor data={(job?.data && JSON.parse(job.data)) || {}} />
        ),
        width: "40%",
        maskClosable: true,
      });
    }
  };

  const onDeleteJob = (jobId: string) => {
    Modal.confirm({
      title: "Are you sure delete this job?",
      content: "This action cannot be undone",
      onOk: () => {
        removeJob(jobId);
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "100px",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "100px",
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "100px",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      width: "200px",
      render: (timestamp: number) => {
        return <span>{new Date(timestamp).toLocaleString()}</span>;
      },
    },
    {
      title: "Delay",
      dataIndex: "delay",
      width: "100px",
    },
    {
      title: "Attempts",
      dataIndex: "attempt",
      width: "100px",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      fixed: "right" as "right",
      width: "300px",
      render: (_: any, record: IJob) => {
        return (
          <Space className={classes.jobActions}>
            <Button
              type="primary"
              shape="round"
              onClick={() => onShowDetail(record.id)}
            >
              Detail
            </Button>
            <Button
              type="primary"
              shape="round"
              onClick={() => setEditingJob(record)}
            >
              Edit
            </Button>
            <Button
              type="primary"
              danger
              shape="round"
              onClick={() => onDeleteJob(record.id)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <section className={classes.root}>
      <Modal
        visible={!!editingJob}
        onOk={() =>
          queueName &&
          editingJob?.id &&
          updateJobData(queueName, editingJob?.id, updatedJobData)
        }
        onCancel={() => onCancelEdit()}
      >
        <JSONEditor
          data={(editingJob?.data && JSON.parse(editingJob.data)) || {}}
          onChange={onChangeJobData}
        />
      </Modal>
      <header className={classes.header}>
        <h1>Queue {queueName}</h1>
        <Space>
          {JOB_TYPES.map((type: string, idx: number) => {
            return (
              <Button
                type={types.includes(type) ? "primary" : "default"}
                shape="round"
                value={type}
                key={`${type}-${idx}`}
                onClick={() => toggleType(type)}
              >
                {type}
              </Button>
            );
          })}
        </Space>
      </header>
      <main>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: currentPageSize,
            current: currentPage,
            total: meta.total,
            onChange: onChangePagination,
          }}
          scroll={{
            x: 500,
            y: 600,
          }}
        />
      </main>
    </section>
  );
};

export default QueueDetail;
