import { InjectQueue } from '@nestjs/bull';
import { OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
import { repeat } from 'rxjs';
import { JobNameEnum } from 'src/common/enums';
import { config } from 'src/config';
import { JobOfferSyncService } from 'src/modules/job-offer/services/job-offer-sync.service';

export class JobScheduleService {
  constructor(
    @InjectQueue(JobNameEnum.JOB_FETCH) private readonly jobQueue: Queue,
  ) {}

  async addFetchJob() {
    await this.jobQueue.add(
      {},
      {
        repeat: { every: config.job.interval * 1000 },
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnFail: false,
      },
    );
  }
}
