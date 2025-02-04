import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { config } from './config';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const logger = app.get(Logger);
  const PORT = config.app.port
  
  logger.log(`Application is starting on port ${PORT}`);
  await app.listen(PORT);
  logger.log(`Application is running on ${await app.getUrl()}...`)
}
bootstrap();
