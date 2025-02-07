import { ApiProperty } from '@nestjs/swagger';
import { NonNegativeNumber, PositiveNumber, ValidDate } from '../types';

export class PaginationBase {
  @ApiProperty({ example: 10 })
  total: NonNegativeNumber;
  @ApiProperty({ example: 1 })
  page: PositiveNumber;
  @ApiProperty({ example: 10 })
  limit: PositiveNumber;
}

export class PaginationResDto<T> {
  data: T[];
  @ApiProperty({ type: () => PaginationBase })
  pagination: PaginationBase;

  constructor(date: T[], pagination: PaginationBase) {
    this.data = date;
    this.pagination = pagination;
  }
}
