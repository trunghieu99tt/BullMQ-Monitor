import { IsString } from "class-validator";

export class UpdateJobInput {
  @IsString()
  connectionStr: string;

  @IsString()
  queueName: string;

  @IsString()
  jobId: string;

  data: any;
}
