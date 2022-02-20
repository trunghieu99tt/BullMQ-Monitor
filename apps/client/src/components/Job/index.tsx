import React, { useState } from "react";
import { IJob } from "../../types/model.type";
import mergeClasses from "../../utils/mergeClasses";
import EditJob from "./Edit";

import defaultClasses from "./job.module.css";

type Props = {
  job: IJob;
  removeJob: (id: string) => void;
  classes?: any;
};

const Job = ({ job, removeJob, classes: propsClasses }: Props) => {
  const classes = mergeClasses(defaultClasses, propsClasses);

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleActive = () => setIsActive((v) => !v);
  const toggleEdit = () => setIsEditing((v) => !v);

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
          <button onClick={toggleActive}>Detail</button>
          <button onClick={toggleEdit}>Edit</button>
          <button onClick={() => removeJob(job.id)}>Delete</button>
        </td>
      </tr>
      {isEditing && (
        <tr>
          <td colSpan={100}>
            <EditJob job={job} />
          </td>
        </tr>
      )}
      {isActive && (
        <tr>
          <td colSpan={100}>
            <div className={classes.jobDetailData}>{job.data}</div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default Job;
