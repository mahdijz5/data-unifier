type JobLocation = {
  city: string;
  state: string;
  remote: boolean;
};

type JobCompensation = {
  min: number;
  max: number;
  currency: string;
};

type JobEmployer = {
  companyName: string;
  website: string;
};

type JobRequirements = {
  experience: number;
  technologies: string[];
};

type Job = {
  position: string;
  location: JobLocation;
  compensation: JobCompensation;
  employer: JobEmployer;
  requirements: JobRequirements;
  datePosted: Date;
};

type JobList = {
  [key: string]: Job;
};

export type Provider2ResponseType = {
  status: string;
  data: { jobsList: JobList };
};
