import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config';
import { Provider1Service } from './provider1.service';
import { Provider2Service } from './provider2.service';
import { JobProviderFactory } from './job.provider.factory';
import { HttpModule } from '@nestjs/axios';
import { InjectTokenEnum } from 'src/common/enums';

@Module({
  imports: [HttpModule],
  providers: [
    JobProviderFactory,
    {
      provide: InjectTokenEnum.PROVIDER_1,
      useClass: Provider1Service,
    },
    {
      provide: InjectTokenEnum.PROVIDER_2,
      useClass: Provider2Service,
    },
  ],
  exports: [JobProviderFactory],
})
export class JobProviderModule {}
