import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError } from 'axios';
import { of, throwError } from 'rxjs';
import { CreateJobOffer } from 'src/modules/job-offer/domain/create-job-offer';
import { Provider1Service } from '../provider1.service';
import { Provider1ResponseType } from '../types';

describe('Provider1Service', () => {
  let provider1Service: Provider1Service;
  let httpServiceMock: jest.Mocked<HttpService>;

  beforeEach(async () => {
    httpServiceMock = {
      get: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Provider1Service,
        { provide: HttpService, useValue: httpServiceMock },
      ],
    }).compile();

    provider1Service = module.get<Provider1Service>(Provider1Service);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch jobs and convert data correctly', async () => {
    const mockResponse: Provider1ResponseType = {
      metadata: {
        requestId: 'requestId',
        timestamp: new Date().toString(),
      },
      jobs: [
        {
          jobId: '123',
          title: 'Software Engineer',
          company: { name: 'Tech Corp', industry: 'IT' },
          details: {
            location: 'New York',
            type: 'Full-Time',
            salaryRange: '$50k - $70k',
          },
          postedDate: new Date(),
          skills: ['Node.js', 'NestJS'],
        },
      ],
    };

    httpServiceMock.get.mockReturnValue(of({ data: mockResponse }) as any);

    const result = await provider1Service.fetchJobs();

    expect(result).toHaveLength(1);
    expect(result[0].salaryMin).toBe(50000);
    expect(result[0].salaryMax).toBe(70000);
    expect(result[0].workTime).toBe('full-time');
  });

  it('should throw an error if salary range is invalid', async () => {
    const mockResponse: Provider1ResponseType = {
      metadata: {
        requestId: 'requestId',
        timestamp: new Date().toString(),
      },
      jobs: [
        {
          jobId: '123',
          title: 'Software Engineer',
          company: { name: 'Tech Corp', industry: 'IT' },
          details: {
            location: 'New York',
            type: 'Full-Time',
            salaryRange: '$90k - $70k',
          },
          postedDate: new Date(),
          skills: ['Node.js', 'NestJS'],
        },
      ],
    };

    httpServiceMock.get.mockReturnValue(of({ data: mockResponse }) as any);

    await expect(provider1Service.fetchJobs()).rejects.toThrow();
  });

  it('should  throw if HTTP request fails', async () => {
    const axiosError = new AxiosError('Request failed');
    httpServiceMock.get.mockReturnValue(throwError(() => axiosError));

    await expect(provider1Service.fetchJobs()).rejects.toThrow(axiosError);
  });
});
