import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { JobNameEnum } from './common/enums';
import { config } from './config/app.config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { JobScheduleService } from './job-schedule/job-schedule.service';
import { JobProcessor } from './job-schedule/job.processor';
import { LoggerModule } from './logger';
import { JobOfferModule } from './modules/job-offer/job-offer.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: config.redis.host,
        port: config.redis.port,
      },
    }),
    BullModule.registerQueue({
      name: JobNameEnum.JOB_FETCH,
    }),
    LoggerModule,
    JobOfferModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [JobScheduleService, JobProcessor],
})
export class AppModule {}
