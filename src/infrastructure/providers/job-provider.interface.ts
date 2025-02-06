import { CreateJobOffer } from 'src/modules/job-offer/domain/create-job-offer';

export interface JobProviderInterface {
  fetchJobs(): Promise<CreateJobOffer[]>;
}
