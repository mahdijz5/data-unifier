import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';
import { JobProcessor } from './job.processor';
import { JobOfferSyncService } from 'src/modules/job-offer/services/job-offer-sync.service';

describe('JobProcessor', () => {
  let jobProcessor: JobProcessor;
  let jobOfferSyncServiceMock: jest.Mocked<JobOfferSyncService>;

  beforeEach(async () => {
    jobOfferSyncServiceMock = {
      syncData: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobProcessor,
        { provide: JobOfferSyncService, useValue: jobOfferSyncServiceMock },
      ],
    }).compile();

    jobProcessor = module.get<JobProcessor>(JobProcessor);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should process job and call syncData()', async () => {
    const mockJob = { id: '123', attemptsMade: 0 } as Job;

    await jobProcessor.handleFetchJob(mockJob);

    expect(jobOfferSyncServiceMock.syncData).toHaveBeenCalled();
  });

  it('should rethrow if syncData() fails', async () => {
    const mockJob = { id: '456', attemptsMade: 1 } as Job;
    const error = new Error('Sync failed');

    jobOfferSyncServiceMock.syncData.mockRejectedValue(error);

    await expect(jobProcessor.handleFetchJob(mockJob)).rejects.toThrow(error);
  });
});
