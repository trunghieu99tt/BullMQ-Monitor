import { IJob } from "../types/model.type";

export class Job {
  data: IJob;

  constructor(rawData: any) {
    this.data = this.convertToJob(rawData);
  }

  convertToJob(rawData: any): IJob {
    return {
      id: rawData?.id || "",
      status: rawData?.status || "",
      name: rawData?.name || "",
      timestamp: rawData?.timestamp || 0,
      delay: rawData?.delay || 0,
      attempt: rawData?.attempt || 0,
      data: rawData?.data || "",
    };
  }

  getData(): IJob {
    return this.data;
  }
}
