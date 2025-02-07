import { Injectable, Logger } from '@nestjs/common';
import { JobProviderInterface } from './job-provider.interface';
import { JobOffer } from 'src/modules/job-offer/domain/job-offer';
import { HttpService } from '@nestjs/axios';
import { config } from 'src/config';
import { catchError, lastValueFrom, throwError, timeout } from 'rxjs';
import { TIMEOUT } from 'src/common/enums/timeout.enum';
import { Provider1ResponseType } from './types';
import { CreateJobOffer } from 'src/modules/job-offer/domain/create-job-offer';
import { match } from 'ts-pattern';
import { AxiosError } from 'axios';

@Injectable()
export class Provider1Service implements JobProviderInterface {
  private readonly logger = new Logger(Provider1Service.name);

  constructor(private readonly http: HttpService) {}
  async fetchJobs(): Promise<CreateJobOffer[]> {
    try {
      const { data }: { data: Provider1ResponseType } = await lastValueFrom(
        this.http.get(config.api.provider1.url).pipe(
          timeout({
            first: TIMEOUT.SHORT,
            meta: `Provider ${Provider1Service.name} is not responding.`,
          }),
          catchError((error) => {
            this.logger.error(error);
            return throwError(() => error);
          }),
        ),
      );

      const convertedData = data.jobs.map((item) => {
        const { max, min } = this.extractSalaryRange(item.details.salaryRange);
        const workTime: JobOffer.WorkTime = match(item)
          .with(
            { details: { type: 'Contract' } },
            (): JobOffer.WorkTime => 'contract',
          )
          .with(
            { details: { type: 'Full-Time' } },
            (): JobOffer.WorkTime => 'full-time',
          )
          .with(
            { details: { type: 'Part-Time' } },
            (): JobOffer.WorkTime => 'part-time',
          )
          .exhaustive();

        return CreateJobOffer.mk({
          company: {
            name: item.company.name,
            industry: item.company.industry,
          },
          isRemote: false,
          jobId: item.jobId,
          location: item.details.location,
          postedDate: new Date(item.postedDate),
          salaryMax: max,
          salaryMin: min,
          skills: item.skills,
          title: item.title,
          workTime,
        });
      });

      return convertedData;
    } catch (error) {
      throw error;
    }
  }

  private extractSalaryRange(salaryRange: string): {
    min: number;
    max: number;
  } {
    const regex = /\$(\d+)k\s*-\s*\$(\d+)k/;
    const match = salaryRange.match(regex);

    if (match) {
      const minSalary = parseInt(match[1]) * 1000;
      const maxSalary = parseInt(match[2]) * 1000;
      return { min: minSalary, max: maxSalary };
    }

    throw new Error('Invalid Salary range.');
  }
}
