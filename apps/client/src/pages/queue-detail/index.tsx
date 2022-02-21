import { JOB_TYPES } from "../../constants";
import { useQueueDetail } from "./useQueueDetail";

import classes from "./queue-detail.module.css";
import { Button, Modal, Table } from "antd";
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
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
    },
    {
      title: "Delay",
      dataIndex: "delay",
    },
    {
      title: "Attempts",
      dataIndex: "attempt",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: IJob) => {
        return (
          <div className={classes.jobActions}>
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
          </div>
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
      <header>
        <h1>Queue {queueName}</h1>
        <div>
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
        </div>
      </header>
      <main>
        <Table
          columns={columns}
          dataSource={data}
          key={currentPage}
          pagination={{
            pageSize: currentPageSize,
            current: currentPage,
            total: meta.total,
            onChange: onChangePagination,
          }}
        />
      </main>
    </section>
  );
};

export default QueueDetail;
