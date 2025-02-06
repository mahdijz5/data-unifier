import { Inject, Injectable } from '@nestjs/common';
import { InjectTokenEnum } from 'src/common/enums';
import { JobProviderInterface } from './job-provider.interface';
import { JobOffer } from 'src/modules/job-offer/domain/job-offer';
import { CreateJobOffer } from 'src/modules/job-offer/domain/create-job-offer';

@Injectable()
export class JobProviderFactory {
  constructor(
    @Inject(InjectTokenEnum.PROVIDER_1)
    private readonly provider1Service: JobProviderInterface,
    @Inject(InjectTokenEnum.PROVIDER_2)
    private readonly provider2Service: JobProviderInterface,
  ) {}

  async fetchAll(): Promise<CreateJobOffer[]> {
    const [job1, job2] = await Promise.all([
      this.provider1Service.fetchJobs(),
      this.provider2Service.fetchJobs(),
    ]);

    return [...job1, ...job2];
  }
}
