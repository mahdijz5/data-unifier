import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/app.config';
import { LoggerModule } from './logger';
import { BullModule } from '@nestjs/bull';
import { JobNameEnum } from './common/enums';
import { JobScheduleService } from './job-schedule/job-schedule.service';
import { JobProcessor } from './job-schedule/job.processor';

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
  ],
  controllers: [AppController],
  providers: [AppService, JobScheduleService, JobProcessor],
})
export class AppModule {}
