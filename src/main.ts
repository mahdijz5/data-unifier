import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { config } from './config';
import { JobScheduleService } from './job-schedule/job-schedule.service';
import * as express from 'express';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/Interceptor';
import { AllExceptionFilter } from './common/filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);

  app.useLogger(logger);
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const jobSchedule = app.get(JobScheduleService);

  const server = express();
  const { router } = createBullBoard([
    new BullAdapter(jobSchedule['jobQueue']),
  ]);

  server.use('/admin/queues', router);

  const PORT = config.app.port;
  const BULL_BOARD_PORT = config.app.bullBoardPort;

  server.listen(BULL_BOARD_PORT, () =>
    logger.log(
      `Bull Board is running on http://[::1]:${BULL_BOARD_PORT}/admin/queues `,
    ),
  );

  const options = new DocumentBuilder()
    .setTitle('Data Unifier')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.app.docPath, app, document);

  await jobSchedule.addFetchJob();
  await app.listen(PORT);
  logger.log(`Application is running on ${await app.getUrl()}...`);
}
bootstrap();
