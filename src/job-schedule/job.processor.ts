import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { JobNameEnum } from 'src/common/enums';
import { JobOfferSyncService } from 'src/modules/job-offer/services/job-offer-sync.service';

@Processor(JobNameEnum.JOB_FETCH)
export class JobProcessor {
  constructor(private readonly jobOfferSyncService: JobOfferSyncService) {}
  private readonly logger = new Logger(JobProcessor.name);
  @Process()
  async handleFetchJob(job: Job) {
    try {
      this.logger.log(
        `Processing job: ${job.id}, Attempts ${job.attemptsMade + 1}`,
      );

      await this.jobOfferSyncService.syncData();

      this.logger.log(`job ${job.id} completed successfully`);
    } catch (error) {
      this.logger.debug(`job ${job.id} failed ${JSON.stringify(error)} `);
      throw error;
    }
  }
}
