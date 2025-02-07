import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateJobOffer } from 'src/modules/job-offer/domain/create-job-offer';
import { JobOffer } from 'src/modules/job-offer/domain/job-offer';
import { Option, some, none } from 'fp-ts/lib/Option';
import {
  NonEmptyString,
  PositiveNumber,
  StrictBoolean,
} from 'src/common/types';
import { JobOfferManager } from '../jobOffer.manager';
import { CompanyEntity } from '../../entities/company.entity';
import { JobOfferEntity } from '../../entities/job-offer.entity';

describe('JobOfferManager', () => {
  let jobOfferManager: JobOfferManager;
  let jobOfferRepository: jest.Mocked<Repository<JobOfferEntity>>;
  let companyRepository: jest.Mocked<Repository<CompanyEntity>>;
  let dataSource: jest.Mocked<DataSource>;

  beforeEach(async () => {
    jobOfferRepository = {
      save: jest.fn(),
      findAndCount: jest.fn(),
      exists: jest.fn(),
    } as any;

    companyRepository = {
      save: jest.fn(),
    } as any;

    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        manager: {
          getRepository: jest.fn().mockImplementation(() => companyRepository),
          save: jest
            .fn()
            .mockImplementation((entity) => Promise.resolve(entity)),
        },
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobOfferManager,
        {
          provide: getRepositoryToken(JobOfferEntity),
          useValue: jobOfferRepository,
        },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    jobOfferManager = module.get<JobOfferManager>(JobOfferManager);
  });

  it('should create a job offer successfully', async () => {
    const mockJobOffer = CreateJobOffer.mk({
      jobId: '123',
      title: 'Software Engineer',
      company: { name: 'Tech Corp', industry: 'It' },
      salaryMin: 50000,
      salaryMax: 70000,
      location: 'New York',
      workTime: 'full-time',
      isRemote: false,
      postedDate: new Date(),
      skills: ['Node.js'],
    });

    companyRepository.save.mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440000' as any,
      ...mockJobOffer.company,
    } as any);
    jobOfferRepository.save.mockResolvedValue({
      ...mockJobOffer,
      id: '550e8400-e29b-41d4-a716-446655440000',
    } as any);
    jest.spyOn(JobOffer, 'mk').mockReturnValue({} as JobOffer);
    await jobOfferManager.create(mockJobOffer);

    expect(dataSource.createQueryRunner().commitTransaction).toHaveBeenCalled();
  });

  it('should rollback transaction on failure', async () => {
    const mockJobOffer = CreateJobOffer.mk({
      jobId: '123',
      title: 'Software Engineer',
      company: { name: 'Tech Corp', industry: 'It' },
      salaryMin: 50000,
      salaryMax: 70000,
      location: 'New York',
      workTime: 'full-time',
      isRemote: false,
      postedDate: new Date(),
      skills: ['Node.js'],
    });

    companyRepository.save.mockRejectedValue(new Error('Database error'));

    await expect(jobOfferManager.create(mockJobOffer)).rejects.toThrow(
      'Database error',
    );
    expect(
      dataSource.createQueryRunner().rollbackTransaction,
    ).toHaveBeenCalled();
  });

  it('should paginate job offers correctly', async () => {
    jobOfferRepository.findAndCount.mockResolvedValue([
      [{ jobId: '123', title: 'Dev' } as any],
      1,
    ]);

    const result = await jobOfferManager.pagination(
      {
        title: some('Dev' as any),
        location: none,
        isRemote: none,
        salaryMin: none,
        salaryMax: none,
        workTime: none,
      },
      1 as any,
      10 as any,
    );

    expect(result[0]).toHaveLength(1);
    expect(result[1]).toBe(1);
  });

  it('should check job existence correctly', async () => {
    jobOfferRepository.exists.mockResolvedValue(true);

    const exists = await jobOfferManager.isExists('123' as any);
    expect(exists).toBeTruthy();
  });
});
