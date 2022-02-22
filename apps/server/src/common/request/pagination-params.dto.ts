import { IsNumber } from "class-validator";

export class PaginationParams {
  @IsNumber()
  page = 1;

  @IsNumber()
  pageSize = 10;
}
