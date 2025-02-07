import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCustomOkResponse } from 'src/common/decorator/api-ok-response.decorator';
import { z } from 'zod';
import { JobOfferService } from '../services/job-offer.service';
import {
  JobOfferPaginationDto,
  JobOfferPaginationResponseDto,
  JobOfferPaginationSchema,
} from './dto';

@ApiTags('Job-Offer')
@Controller({ path: 'job-offer', version: '1' })
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @ApiCustomOkResponse(JobOfferPaginationResponseDto)
  @ApiOperation({ summary: 'Retrieve the transformed data from the database.' })
  @HttpCode(HttpStatus.OK)
  @Post('pagination')
  async pagination(@Body() data: JobOfferPaginationDto) {
    try {
      const validatedData = JobOfferPaginationSchema.parse(data) as Required<
        z.infer<typeof JobOfferPaginationSchema>
      >;

      return this.jobOfferService.pagination({
        filter: validatedData.filter as Required<typeof validatedData.filter>,
        limit: validatedData.limit,
        page: validatedData.page,
      });
    } catch (error) {
      throw error;
    }
  }
}
