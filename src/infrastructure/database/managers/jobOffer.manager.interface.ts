import { Option } from 'fp-ts/Option';
import {
  NonEmptyString,
  NonNegativeNumber,
  PositiveNumber,
  StrictBoolean,
} from 'src/common/types';
import { CreateJobOffer } from 'src/modules/job-offer/domain/create-job-offer';
import { JobOffer } from 'src/modules/job-offer/domain/job-offer';

type JobOfferFilter = {
  location: Option<NonEmptyString>;
  title: Option<NonEmptyString>;
  isRemote: Option<StrictBoolean>;
  salaryMin: Option<PositiveNumber>;
  salaryMax: Option<PositiveNumber>;
  workTime: Option<JobOffer.WorkTime>;
};

export interface JobOfferManagerInterface {
  create(data: CreateJobOffer): Promise<JobOffer>;
  pagination(
    filter: JobOfferFilter,
    page: PositiveNumber,
    limit: PositiveNumber,
  ): Promise<[JobOffer[], NonNegativeNumber]>;

  isExists(id: NonEmptyString): Promise<StrictBoolean>;
}
