import { Test, TestingModule } from '@nestjs/testing';
import { z } from 'zod';
import {
  JobOfferPaginationDto,
  JobOfferPaginationResponseDto,
  JobOfferPaginationSchema,
} from '../controllers/dto';
import { JobOfferController } from '../controllers/job-offer.controller';
import { JobOfferService } from '../services/job-offer.service';

describe('JobOfferController', () => {
  let controller: JobOfferController;
  let jobOfferServiceMock: jest.Mocked<JobOfferService>;

  beforeEach(async () => {
    jobOfferServiceMock = {
      pagination: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobOfferController],
      providers: [{ provide: JobOfferService, useValue: jobOfferServiceMock }],
    }).compile();

    controller = module.get<JobOfferController>(JobOfferController);
  });

  it('should call jobOfferService.pagination with validated data', async () => {
    const mockRequestData: JobOfferPaginationDto = {
      filter: { title: 'Developer' },
      limit: 10,
      page: 1,
    };

    const validatedData = JobOfferPaginationSchema.parse(mockRequestData);

    const mockResponse: JobOfferPaginationResponseDto = {
      data: [],
      pagination: {
        limit: validatedData.limit,
        page: validatedData.page,
        total: 0 as any,
      },
    };

    jobOfferServiceMock.pagination.mockResolvedValue(mockResponse as any);

    const result = await controller.pagination(mockRequestData);

    expect(jobOfferServiceMock.pagination).toHaveBeenCalledWith({
      filter: validatedData.filter as Required<typeof validatedData.filter>,
      limit: validatedData.limit,
      page: validatedData.page,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should throw validation error if data is invalid', async () => {
    const invalidData: any = {
      filter: 123,
      limit: 'ten',
      page: -1,
    };

    await expect(controller.pagination(invalidData)).rejects.toThrow(
      z.ZodError,
    );
    expect(jobOfferServiceMock.pagination).not.toHaveBeenCalled();
  });

  it('should return 200 OK on successful call', async () => {
    const mockRequestData: JobOfferPaginationDto = {
      filter: { title: 'Backend Engineer' },
      limit: 5,
      page: 1,
    };

    const validatedData = JobOfferPaginationSchema.parse(mockRequestData);

    const mockResponse: JobOfferPaginationResponseDto = {
      data: [],
      pagination: {
        limit: validatedData.limit,
        page: validatedData.page,
        total: 0 as any,
      },
    };

    jobOfferServiceMock.pagination.mockResolvedValue(mockResponse as any);

    const result = await controller.pagination(mockRequestData);

    expect(result).toEqual(mockResponse);
    expect(jobOfferServiceMock.pagination).toHaveBeenCalledTimes(1);
  });
});
