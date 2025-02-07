import { Test, TestingModule } from '@nestjs/testing';
import { InjectTokenEnum } from 'src/common/enums';
import { StrictBoolean } from 'src/common/types';
import { JobOfferManagerInterface } from 'src/infrastructure/database/managers/jobOffer.manager.interface';
import { JobProviderFactory } from 'src/infrastructure/providers/job.provider.factory';
import { CreateJobOffer } from '../../domain/create-job-offer';
import { JobOffer } from '../../domain/job-offer';
import { JobOfferSyncService } from '../job-offer-sync.service';

describe('JobOfferSync Service', () => {
  let service: JobOfferSyncService;
  let jobOfferManagerMock: jest.Mocked<JobOfferManagerInterface>;
  let jobProviderFactoryMock: jest.Mocked<JobProviderFactory>;

  beforeEach(async () => {
    jobOfferManagerMock = {
      isExists: jest.fn(),
      create: jest.fn(),
      pagination: jest.fn(),
    } as any;

    jobProviderFactoryMock = {
      fetchAll: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobOfferSyncService,
        {
          provide: InjectTokenEnum.JOB_OFFER_MANAGER,
          useValue: jobOfferManagerMock,
        },
        { provide: JobProviderFactory, useValue: jobProviderFactoryMock },
      ],
    }).compile();

    service = module.get<JobOfferSyncService>(JobOfferSyncService);
  });

  it('should fetch job offers and create only new ones', async () => {
    const mockJobOffers: CreateJobOffer[] = [
      CreateJobOffer.mk({
        jobId: 'job-1',
        title: 'Software Engineer',
        location: 'New York',
        salaryMin: 5000,
        salaryMax: 120000,
        postedDate: new Date(),
        skills: ['TypeScript', 'NestJS'],
        isRemote: true,
        workTime: JobOffer.WorkTime.Options[0],
        company: {
          name: 'Tech Corp',
          industry: 'IT',
          website: 'https://techcorp.com',
        },
      }),
      CreateJobOffer.mk({
        jobId: 'job-2',
        title: 'Software Engineer',
        location: 'New York',
        salaryMin: 5000,
        salaryMax: 120000,
        postedDate: new Date(),
        skills: ['TypeScript', 'NestJS'],
        isRemote: true,
        workTime: JobOffer.WorkTime.Options[0],
        company: {
          name: 'Tech Corp',
          industry: 'IT',
          website: 'https://techcorp.com',
        },
      }),
    ];

    jobProviderFactoryMock.fetchAll.mockResolvedValue(mockJobOffers);
    jobOfferManagerMock.isExists
      .mockResolvedValueOnce(false as StrictBoolean)
      .mockResolvedValueOnce(true as StrictBoolean);

    await service.syncData();

    expect(jobProviderFactoryMock.fetchAll).toHaveBeenCalledTimes(1);
    expect(jobOfferManagerMock.isExists).toHaveBeenCalledTimes(2);
    expect(jobOfferManagerMock.create).toHaveBeenCalledTimes(1);
    expect(jobOfferManagerMock.create).toHaveBeenCalledWith(mockJobOffers[0]);
  });

  it('should not create any job offer if all exist', async () => {
    const mockJobOffers: CreateJobOffer[] = [
      CreateJobOffer.mk({
        jobId: 'job-1',
        title: 'Software Engineer',
        location: 'New York',
        salaryMin: 5000,
        salaryMax: 120000,
        postedDate: new Date(),
        skills: ['TypeScript', 'NestJS'],
        isRemote: true,
        workTime: JobOffer.WorkTime.Options[0],
        company: {
          name: 'Tech Corp',
          industry: 'IT',
          website: 'https://techcorp.com',
        },
      }),
      CreateJobOffer.mk({
        jobId: 'job-2',
        title: 'Software Engineer',
        location: 'New York',
        salaryMin: 5000,
        salaryMax: 120000,
        postedDate: new Date(),
        skills: ['TypeScript', 'NestJS'],
        isRemote: true,
        workTime: JobOffer.WorkTime.Options[0],
        company: {
          name: 'Tech Corp',
          industry: 'IT',
          website: 'https://techcorp.com',
        },
      }),
    ];

    jobProviderFactoryMock.fetchAll.mockResolvedValue(mockJobOffers);
    jobOfferManagerMock.isExists.mockResolvedValue(true as StrictBoolean);

    await service.syncData();

    expect(jobProviderFactoryMock.fetchAll).toHaveBeenCalledTimes(1);
    expect(jobOfferManagerMock.isExists).toHaveBeenCalledTimes(2);
    expect(jobOfferManagerMock.create).not.toHaveBeenCalled();
  });
});
