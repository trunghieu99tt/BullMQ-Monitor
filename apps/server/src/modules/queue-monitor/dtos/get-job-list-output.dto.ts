import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class GetJobListOutput {
  @IsString()
  name: string;

  @IsString()
  data: string;

  @IsNumber()
  @Type(() => Number)
  attempts: number;

  @IsNumber()
  @Type(() => Number)
  delay: number;

  @IsNumber()
  @Type(() => Number)
  id: number;

  @IsNumber()
  @Type(() => Number)
  progress: number;

  @IsNumber()
  @Type(() => Number)
  timestamp: number;

  @IsString()
  @Type(() => String)
  failedReason: string;
}
