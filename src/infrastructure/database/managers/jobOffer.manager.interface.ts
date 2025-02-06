import {
  NonEmptyString,
  NonNegativeNumber,
  PositiveNumber,
  StrictBoolean,
} from 'src/common/types';
import { CreateJobOffer } from 'src/modules/job-offer/domain/create-job-offer';
import { JobOffer } from 'src/modules/job-offer/domain/job-offer';

type JobOfferFilter = {
  location: NonEmptyString;
  title: NonEmptyString;
  isRemote: StrictBoolean;
  salaryMin: PositiveNumber;
  salaryMax: PositiveNumber;
  workTime: JobOffer.WorkTime;
};

export interface JobOfferManagerInterface {
  create(data: CreateJobOffer): Promise<JobOffer>;
  pagination(
    filter: Partial<JobOfferFilter>,
    page: PositiveNumber,
    limit: PositiveNumber,
  ): Promise<[JobOffer[], NonNegativeNumber]>;

  isExists(id: NonEmptyString): Promise<StrictBoolean>;
}
