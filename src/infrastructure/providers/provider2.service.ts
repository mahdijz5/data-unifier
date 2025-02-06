import { Injectable, Logger } from '@nestjs/common';
import { JobProviderInterface } from './job-provider.interface';
import { JobOffer } from 'src/modules/job-offer/domain/job-offer';
import { HttpService } from '@nestjs/axios';
import { config } from 'src/config';
import { catchError, lastValueFrom, throwError, timeout } from 'rxjs';
import { TIMEOUT } from 'src/common/enums/timeout.enum';
import { Provider2ResponseType } from './types';
import { CreateJobOffer } from 'src/modules/job-offer/domain/create-job-offer';

@Injectable()
export class Provider2Service implements JobProviderInterface {
  private readonly logger = new Logger(Provider2Service.name);

  constructor(private readonly http: HttpService) {}
  async fetchJobs(): Promise<CreateJobOffer[]> {
    const { data }: { data: Provider2ResponseType } = await lastValueFrom(
      this.http.get(config.api.provider2.url).pipe(
        timeout({
          first: TIMEOUT.SHORT,
          meta: `Provider ${Provider2Service.name} is not responding.`,
        }),
        catchError((error) => {
          this.logger.error(error);
          return throwError(() => error);
        }),
      ),
    );

    const jobs = Object.values(data.data.jobsList);
    const jobIdList = Object.keys(data.data.jobsList);

    const convertedData = jobs.map((item, index) => {
      return CreateJobOffer.mk({
        company: {
          name: item.employer.companyName,
          website: item.employer.website,
        },
        isRemote: item.location.remote,
        jobId: jobIdList[index].replace('job', 'P2'),
        location: item.location.city + ', ' + item.location.state,
        postedDate: new Date(item.datePosted),
        salaryMax: item.compensation.max,
        salaryMin: item.compensation.min,
        skills: item.requirements.technologies,
        title: item.position,
        workTime: 'full-time',
      });
    });
    return convertedData;
  }
}
