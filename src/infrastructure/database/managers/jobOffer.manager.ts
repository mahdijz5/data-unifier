import { InjectRepository } from '@nestjs/typeorm';
import { JobOffer } from 'src/modules/job-offer/domain/job-offer';
import {
  DataSource,
  Repository,
  FindManyOptions,
  Like,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { JobOfferEntity } from '../entities/job-offer.entity';
import { JobOfferManagerInterface } from './jobOffer.manager.interface';
import { Injectable } from '@nestjs/common';
import {
  NonEmptyString,
  NonNegativeNumber,
  PositiveNumber,
  StrictBoolean,
} from 'src/common/types';
import { CreateJobOffer } from 'src/modules/job-offer/domain/create-job-offer';
import { CompanyEntity } from '../entities/company.entity';
import { isSome } from 'fp-ts/lib/Option';

@Injectable()
export class JobOfferManager implements JobOfferManagerInterface {
  constructor(
    @InjectRepository(JobOfferEntity)
    private readonly jobOfferRepository: Repository<JobOfferEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(data: CreateJobOffer): Promise<JobOffer> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const company = await queryRunner.manager
        .getRepository(CompanyEntity)
        .save({
          name: data.company.name,
          industry: isSome(data.company.industry)
            ? data.company.industry.value
            : null,
          website: isSome(data.company.website)
            ? data.company.website.value
            : null,
        });

      const jobOffer = await queryRunner.manager
        .getRepository(JobOfferEntity)
        .save({
          ...data,
          company,
        });

      await queryRunner.commitTransaction();

      return JobOffer.mk({
        ...jobOffer,
        company,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      queryRunner.release();
    }
  }

  async pagination(
    filter: Partial<{
      title: NonEmptyString;
      location: NonEmptyString;
      isRemote: StrictBoolean;
      salaryMin: PositiveNumber;
      salaryMax: PositiveNumber;
      workTime: JobOffer.WorkTime;
    }>,
    page: PositiveNumber,
    limit: PositiveNumber,
  ): Promise<[JobOffer[], NonNegativeNumber]> {
    const where: FindManyOptions<JobOfferEntity>['where'] = {};

    if (filter.title) where.title = Like(`%${filter.title}%`);
    if (filter.location) where.location = Like(`%${filter.location}%`);
    if (filter.salaryMin) where.salaryMin = MoreThanOrEqual(filter.salaryMin);
    if (filter.salaryMax) where.salaryMax = LessThanOrEqual(filter.salaryMax);
    if (filter.workTime) where.workTime = filter.workTime;

    const [entities, total] = await this.jobOfferRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { postedDate: 'DESC' },
    });

    return [
      entities.map((item) => JobOffer.mk(item)),
      NonNegativeNumber.mkUnsafe(total),
    ];
  }

  async isExists(id: NonEmptyString): Promise<StrictBoolean> {
    const result = await this.jobOfferRepository.exists({
      where: { jobId: id },
    });
    return StrictBoolean.mkUnsafe(result);
  }
}
