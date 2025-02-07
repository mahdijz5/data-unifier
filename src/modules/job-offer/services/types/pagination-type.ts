import { Option } from 'fp-ts/Option';
import {
  NonEmptyString,
  PositiveNumber,
  StrictBoolean,
} from 'src/common/types';
import { JobOffer } from '../../domain/job-offer';

export type JobOfferPagination = {
  filter: {
    title: Option<NonEmptyString>;
    location: Option<NonEmptyString>;
    isRemote: Option<StrictBoolean>;
    salaryMin: Option<PositiveNumber>;
    salaryMax: Option<PositiveNumber>;
    workTime: Option<JobOffer.WorkTime>;
  };
  page: PositiveNumber;
  limit: PositiveNumber;
};

export type JobOfferPaginationResponse = {
  filter: {
    title: Option<NonEmptyString>;
    location: Option<NonEmptyString>;
    isRemote: Option<StrictBoolean>;
    salaryMin: Option<PositiveNumber>;
    salaryMax: Option<PositiveNumber>;
    workTime: Option<JobOffer.WorkTime>;
  };
  page: PositiveNumber;
  limit: PositiveNumber;
};
