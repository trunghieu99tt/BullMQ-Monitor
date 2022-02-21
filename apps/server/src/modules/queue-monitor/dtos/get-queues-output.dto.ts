import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class GetQueuesOutputDto {
  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  active: number;

  @IsNumber()
  @Type(() => Number)
  completed: number;

  @IsNumber()
  @Type(() => Number)
  delayed: number;

  @IsNumber()
  @Type(() => Number)
  failed: number;

  @IsNumber()
  @Type(() => Number)
  paused: number;

  @IsNumber()
  @Type(() => Number)
  waiting: number;

  @IsNumber()
  @Type(() => Number)
  total: number;

  @IsBoolean()
  @Type(() => Boolean)
  isPaused: boolean;
}
