import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class GetQueuesOutputDto {
  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  numberOfJobs: number;

  @IsBoolean()
  @Type(() => Boolean)
  isPaused: boolean;
}
