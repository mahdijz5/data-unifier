import { JobOffer } from 'src/modules/job-offer/domain/job-offer';

export interface JobProvider {
  fetchJobs(): Promise<JobOffer>;
}
