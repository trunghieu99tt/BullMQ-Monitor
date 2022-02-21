import { IsString } from "class-validator";
import { PaginationParams } from "../../../common/request/pagination-params.dto";

export class GetJobListQuery extends PaginationParams {
  @IsString()
  connectionStr: string;

  @IsString()
  queueName: string;

  @IsString()
  jobTypes: string;
}
