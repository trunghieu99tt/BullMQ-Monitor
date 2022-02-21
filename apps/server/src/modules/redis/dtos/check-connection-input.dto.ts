import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CheckConnectionInput {
  @IsString()
  host: string;

  @IsNumber()
  @Type(() => Number)
  port: number;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
