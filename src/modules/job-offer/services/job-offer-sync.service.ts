import { Inject, Injectable } from '@nestjs/common';
import { InjectTokenEnum } from 'src/common/enums';
import { StrictBoolean } from 'src/common/types';
import { JobOfferManagerInterface } from 'src/infrastructure/database/managers/jobOffer.manager.interface';
import { JobProviderFactory } from 'src/infrastructure/providers/job.provider.factory';
import { CreateJobOffer } from '../domain/create-job-offer';

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
