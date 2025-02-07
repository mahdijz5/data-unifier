import { Test, TestingModule } from '@nestjs/testing';
import { none, some } from 'fp-ts/Option';
import { PaginationResDto } from 'src/common/dto';
import { InjectTokenEnum } from 'src/common/enums';
import {
  NonEmptyString,
  NonNegativeNumber,
  PositiveNumber,
} from 'src/common/types';
import { JobOfferManagerInterface } from 'src/infrastructure/database/managers/jobOffer.manager.interface';
import { JobOffer } from '../../domain/job-offer';
import { JobOfferService } from '../job-offer.service';
import { JobOfferPagination } from '../types';

describe('JobOffer Service', () => {
  let jobOfferService: JobOfferService;
  let jobOfferManagerMock: jest.Mocked<JobOfferManagerInterface>;

  beforeEach(async () => {
    jobOfferManagerMock = {
      pagination: jest.fn(),
      isExists: jest.fn(),
      create: jest.fn(),
    } as jest.Mocked<JobOfferManagerInterface>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobOfferService,
        {
          provide: InjectTokenEnum.JOB_OFFER_MANAGER,
          useValue: jobOfferManagerMock,
        },
      ],
    }).compile();

    jobOfferService = module.get<JobOfferService>(JobOfferService);
  });

  it('should call jobOfferManager.pagination and return formatted result', async () => {
    const mockData: JobOfferPagination = {
      filter: {
        location: some('Remote' as NonEmptyString.Type),
        isRemote: none,
        salaryMax: none,
        salaryMin: none,
        title: none,
        workTime: none,
      },
      page: PositiveNumber.mkUnsafe(1),
      limit: PositiveNumber.mkUnsafe(10),
    };

    const mockOffers: JobOffer[] = [
      JobOffer.mk({
        id: '550e8400-e29b-41d4-a716-446655440000',
        jobId: 'job123',
        title: 'Backend Developer',
        location: 'Remote',
        salaryMin: 5000,
        salaryMax: 10000,
        postedDate: new Date(),
        skills: ['NestJS', 'TypeScript'],
        isRemote: true,
        workTime: JobOffer.WorkTime.Options[0],
        company: {
          id: '510e8400-e29b-41d4-a716-446655440000',
          name: 'TechCorp',
        },
      }),
    ];

    jobOfferManagerMock.pagination.mockResolvedValue([
      mockOffers,
      NonNegativeNumber.mkUnsafe(1),
    ]);

    const result = await jobOfferService.pagination(mockData);

    expect(jobOfferManagerMock.pagination).toHaveBeenCalledWith(
      mockData.filter,
      mockData.page,
      mockData.limit,
    );

    expect(result).toEqual(
      new PaginationResDto(mockOffers, {
        limit: PositiveNumber.mkUnsafe(10),
        page: PositiveNumber.mkUnsafe(1),
        total: NonNegativeNumber.mkUnsafe(1),
      }),
    );
  });

  it('should throw an error if jobOfferManager.pagination fails', async () => {
    const mockData: JobOfferPagination = {
      filter: {
        isRemote: none,
        location: none,
        salaryMax: none,
        salaryMin: none,
        title: none,
        workTime: none,
      },
      page: PositiveNumber.mkUnsafe(1),
      limit: PositiveNumber.mkUnsafe(10),
    };

    jobOfferManagerMock.pagination.mockRejectedValue(new Error('DB error'));

    await expect(jobOfferService.pagination(mockData)).rejects.toThrow(
      'DB error',
    );
  });
});
