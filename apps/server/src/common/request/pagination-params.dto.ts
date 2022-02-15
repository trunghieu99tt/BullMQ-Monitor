import { IsNumber } from "class-validator";

export class PaginationParams {
  @IsNumber()
  page: number = 1;

  @IsNumber()
  pageSize: number = 10;
}
