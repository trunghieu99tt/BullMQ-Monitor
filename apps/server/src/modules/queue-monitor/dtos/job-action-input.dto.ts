import { IsString } from "class-validator";

export class JobActionInput {
  @IsString()
  connectionStr: string;

  @IsString()
  queueName: string;

  @IsString()
  jobId: string;
}
