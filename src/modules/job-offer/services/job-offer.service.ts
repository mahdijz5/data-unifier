import { Inject, Injectable } from '@nestjs/common';
import { JobOfferDto, PaginationResDto } from 'src/common/dto';
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
  ): Promise<PaginationResDto<JobOfferDto>> {
    try {
      const [offers, total] = await this.jobOfferManager.pagination(
        data.filter,
        data.page,
        data.limit,
      );

      return new PaginationResDto(
        offers.reduce((p, c) => [...p, new JobOfferDto(c)], []),
        {
          limit: data.limit,
          page: data.page,
          total: total,
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
