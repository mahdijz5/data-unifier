import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError } from 'axios';
import { of, throwError } from 'rxjs';
import { Provider1ResponseType, Provider2ResponseType } from '../types';
import { Provider2Service } from '../provider2.service';
import { some } from 'fp-ts/lib/Option';

describe('Provider2Service', () => {
  let provider2Service: Provider2Service;
  let httpServiceMock: jest.Mocked<HttpService>;

  beforeEach(async () => {
    httpServiceMock = {
      get: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Provider2Service,
        { provide: HttpService, useValue: httpServiceMock },
      ],
    }).compile();

    provider2Service = module.get<Provider2Service>(Provider2Service);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch jobs and convert data correctly', async () => {
    const mockResponse: Provider2ResponseType = {
      status: 'success',
      data: {
        jobsList: {
          job447: {
            position: 'Backend Engineer',
            location: {
              city: 'San Francisco',
              state: 'WA',
              remote: true,
            },
            compensation: {
              min: 50000,
              max: 92000,
              currency: 'USD',
            },
            employer: {
              companyName: 'TechCorp',
              website: 'https://creativedesign ltd.com',
            },
            requirements: {
              experience: 2,
              technologies: ['Java', 'Spring Boot', 'AWS'],
            },
            datePosted: new Date(),
          },
        },
      },
    };

    httpServiceMock.get.mockReturnValue(of({ data: mockResponse }) as any);

    const result = await provider2Service.fetchJobs();

    expect(result).toHaveLength(1);
    expect(result[0].salaryMin).toBe(50000);
    expect(result[0].salaryMax).toBe(92000);
    expect(result[0].company.website).toStrictEqual(
      some('https://creativedesign ltd.com'),
    );
  });

  it('should throw an error if salary range is invalid', async () => {
    const mockResponse: Provider2ResponseType = {
      status: 'success',
      data: {
        jobsList: {
          job447: {
            position: 'Backend Engineer',
            location: {
              city: 'San Francisco',
              state: 'WA',
              remote: true,
            },
            compensation: {
              min: 500000,
              max: 92000,
              currency: 'USD',
            },
            employer: {
              companyName: 'TechCorp',
              website: 'https://creativedesign ltd.com',
            },
            requirements: {
              experience: 2,
              technologies: ['Java', 'Spring Boot', 'AWS'],
            },
            datePosted: new Date(),
          },
        },
      },
    };
    httpServiceMock.get.mockReturnValue(of({ data: mockResponse }) as any);

    await expect(provider2Service.fetchJobs()).rejects.toThrow();
  });

  it('should  throw if HTTP request fails', async () => {
    const axiosError = new AxiosError('Request failed');
    httpServiceMock.get.mockReturnValue(throwError(() => axiosError));

    await expect(provider2Service.fetchJobs()).rejects.toThrow(axiosError);
  });
});
