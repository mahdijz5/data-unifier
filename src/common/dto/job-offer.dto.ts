import { isSome } from 'fp-ts/Option';
import { JobOffer } from 'src/modules/job-offer/domain/job-offer';

export class JobOfferDto {
  id: string;
  jobId: string;
  title: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  postedDate: Date;
  skills: string[];
  isRemote: boolean;
  company: {
    id: string;
    name: string;
    industry?: string;
    website: string;
  };
  workTime: string;

  constructor(data: JobOffer) {
    Object.assign(this, data);
    this.company = {
      id: data.company.id,
      name: data.company.name,
      industry: isSome(data.company.industry)
        ? data.company.industry.value
        : null,
      website: isSome(data.company.website) ? data.company.website.value : null,
    };
  }
}
