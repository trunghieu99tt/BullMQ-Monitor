import { IsString } from "class-validator";

export class QueueActionInput {
  @IsString()
  connectionStr: string;

  @IsString()
  queueName: string;
}
