 import { JobOffer } from 'src/modules/job-offer/domain/job-offer';
 
export interface JobOfferManagerInterface  {
  create(data: JobOffer): Promise<JobOffer>;
}
