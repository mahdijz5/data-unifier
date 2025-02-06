import { InjectRepository } from '@nestjs/typeorm';
import { JobOffer } from 'src/modules/job-offer/domain/job-offer';
import { Repository } from 'typeorm';
import { JobOfferEntity } from '../entities/job-offer.entity';
import { JobOfferManagerInterface } from './jobOffer.manager.interface';

export class JobOfferManager implements JobOfferManagerInterface {
  constructor(
    @InjectRepository(JobOfferEntity)
    private readonly jobOfferRepository: Repository<JobOfferEntity>,
  ) {}

  async create(data: JobOffer): Promise<JobOffer> {
    const entity = this.jobOfferRepository.create(this.toEntity(data));
    await this.jobOfferRepository.save(entity);
    return this.toDomain(entity);
  }

  private toEntity(data: JobOffer): Partial<JobOfferEntity> {
    return {
      ...data,
    };
  }

  private toDomain(entity: Parameters<typeof JobOffer.mk>[0]): JobOffer {
    return JobOffer.mk({
      ...entity,
    });
  }
}
