import { Module } from '@nestjs/common';
import { JobOfferSyncService } from './services/job-offer-sync.service';
import { InjectTokenEnum } from 'src/common/enums';
import { JobOfferManager } from 'src/infrastructure/database/managers/jobOffer.manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOfferEntity } from 'src/infrastructure/database/entities/job-offer.entity';
import { CompanyManager } from 'src/infrastructure/database/managers/company.manager';
import { CompanyEntity } from 'src/infrastructure/database/entities/company.entity';
import { JobProviderFactory } from 'src/infrastructure/providers/job.provider.factory';
import { JobProviderModule } from 'src/infrastructure/providers/job-provider.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobOfferEntity, CompanyEntity]),
    JobProviderModule,
  ],
  controllers: [],
  providers: [
    JobOfferSyncService,
    {
      provide: InjectTokenEnum.JOB_OFFER_MANAGER,
      useClass: JobOfferManager,
    },
    {
      provide: InjectTokenEnum.COMPANY_MANAGER,
      useClass: CompanyManager,
    },
  ],
  exports: [JobOfferSyncService],
})
export class JobOfferModule {}
