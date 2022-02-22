import { JobStatus } from "bull";

export const TEN_SECONDS = 10000;

export const JOB_STATUS: JobStatus[] = [
  "waiting",
  "active",
  "completed",
  "failed",
  "delayed",
];
