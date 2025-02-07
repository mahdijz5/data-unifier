import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  NonEmptyString,
  PositiveNumber,
  StrictBoolean,
} from 'src/common/types';
import { z } from 'zod';
import { JobOffer } from '../../domain/job-offer';
import { OptionSchema } from 'src/common/validation';

class Filter {
  @ApiPropertyOptional({
    type: String,
    example: 'Backend developer',
  })
  title?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Canada',
  })
  location?: string;

  @ApiPropertyOptional({
    type: Boolean,
    example: false,
  })
  isRemote?: boolean;

  @ApiPropertyOptional({
    type: Number,
    example: 200,
  })
  salaryMin?: number;

  @ApiPropertyOptional({
    type: Number,
    example: 500,
  })
  salaryMax?: number;

  @ApiPropertyOptional({
    type: String,
    example: JobOffer.WorkTime[0],
  })
  workTime?: string;
}

export class JobOfferPaginationDto {
  @ApiProperty({ type: () => Filter })
  filter: Filter;

  @ApiPropertyOptional({
    type: Number,
    example: 1,
  })
  page: number;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
  })
  limit: number;
}

const FilterSchema = z.object({
  title: OptionSchema(z.string().refine(NonEmptyString.is).optional()),
  location: OptionSchema(z.string().refine(NonEmptyString.is).optional()),
  isRemote: OptionSchema(z.boolean().refine(StrictBoolean.is).optional()),
  salaryMin: OptionSchema(z.number().refine(PositiveNumber.is).optional()),
  salaryMax: OptionSchema(z.number().refine(PositiveNumber.is).optional()),
  workTime: OptionSchema(z.string().refine(JobOffer.WorkTime.is).optional()),
});

export const JobOfferPaginationSchema = z.object({
  filter: FilterSchema,
  page: z.number().refine(PositiveNumber.is),
  limit: z.number().refine(PositiveNumber.is),
});
