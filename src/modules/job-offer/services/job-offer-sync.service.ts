import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JobOffer } from '../domain/job-offer';
import { InjectTokenEnum } from 'src/common/enums';
import { JobOfferManagerInterface } from 'src/infrastructure/database/managers/jobOffer.manager.interface';
import { StrictBoolean } from 'src/common/types';
import { CompanyManagerInterface } from 'src/infrastructure/database/managers/company.manager.interface';
import { Company } from '../domain/company';
import { CreateJobOffer } from '../domain/create-job-offer';
import { JobProviderFactory } from 'src/infrastructure/providers/job.provider.factory';

@Injectable()
export class JobOfferSyncService {
  constructor(
    @Inject(InjectTokenEnum.JOB_OFFER_MANAGER)
    private readonly jobOfferManager: JobOfferManagerInterface,
    private readonly jobProviderFactory: JobProviderFactory,
  ) {}

  async syncData() {
    try {
      const offers = await this.jobProviderFactory.fetchAll();

      const list = (
        await Promise.all(
          offers.map(async (c) => {
            const exists = await this.isExist(c);
            return exists ? null : c;
          }),
        )
      ).filter((item) => item !== null);

      const tasks = list.reduce(
        (pr, c) => [...pr, this.jobOfferManager.create(c)],
        [],
      );

      await Promise.all(tasks);
    } catch (error) {
      throw error;
    }
  }

  private async isExist(job: CreateJobOffer): Promise<StrictBoolean> {
    return await this.jobOfferManager.isExists(job.jobId);
  }
}
