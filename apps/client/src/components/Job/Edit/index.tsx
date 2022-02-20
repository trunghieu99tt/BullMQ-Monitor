import { ChangeEvent, useState } from "react";
import { IJob } from "../../../types/model.type";

type Props = {
  job: IJob;
};

const EditJob = ({ job }: Props) => {
  const [newJobData, setNewJobData] = useState<string>(job.data);

  const onChangeData = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewJobData(e.target.value);
  };

  const onEditJobData = async () => {
    try {
      const parsedNewJobData = JSON.parse(newJobData);
      if (parsedNewJobData) {
        console.log("parsedNewJobData", parsedNewJobData);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <div>
      {job?.data && <textarea value={newJobData} onChange={onChangeData} />}
      <button onClick={onEditJobData}>Edit</button>
    </div>
  );
};

export default EditJob;
