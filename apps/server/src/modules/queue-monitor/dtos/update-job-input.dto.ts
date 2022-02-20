import { IsString } from "class-validator";

export class UpdateJobInput {
  @IsString()
  queueName: string;

  @IsString()
  jobId: string;

  data: any;
}
