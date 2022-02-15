import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class GetJobCountsOutput {
  @IsNumber()
  @Type(() => Number)
  total: number;

  @IsNumber()
  @Type(() => Number)
  failedJobs: number;

  @IsNumber()
  @Type(() => Number)
  completedJobs: number;

  @IsNumber()
  @Type(() => Number)
  waitingJobs: number;

  @IsNumber()
  @Type(() => Number)
  activeJobs: number;

  @IsNumber()
  @Type(() => Number)
  delayedJobs: number;

  @IsNumber()
  @Type(() => Number)
  pausedJobs: number;
}
