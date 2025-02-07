import { Inject, Injectable } from '@nestjs/common';
import { PaginationResDto } from 'src/common/dto';
import { InjectTokenEnum } from 'src/common/enums';
import { JobOfferManagerInterface } from 'src/infrastructure/database/managers/jobOffer.manager.interface';
import { JobOffer } from '../domain/job-offer';
import { JobOfferPagination } from './types';

@Injectable()
export class JobOfferService {
  constructor(
    @Inject(InjectTokenEnum.JOB_OFFER_MANAGER)
    private readonly jobOfferManager: JobOfferManagerInterface,
  ) {}

  async pagination(
    data: JobOfferPagination,
  ): Promise<PaginationResDto<JobOffer>> {
    try {
      const [offers, total] = await this.jobOfferManager.pagination(
        data.filter,
        data.page,
        data.limit,
      );
      return new PaginationResDto(offers, {
        limit: data.limit,
        page: data.page,
        total: total,
      });
    } catch (error) {
      throw error;
    }
  }
}
