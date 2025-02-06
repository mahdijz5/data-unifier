type JobDetails = {
  location: string;
  type: 'Full-Time' | 'Contract' | 'Part-Time';
  salaryRange: string;
};

type Company = {
  name: string;
  industry: string;
};

type Job = {
  jobId: string;
  title: string;
  details: JobDetails;
  company: Company;
  skills: string[];
  postedDate: Date;
};

type Metadata = {
  requestId: string;
  timestamp: string;
};

export type Provider1ResponseType = {
  metadata: Metadata;
  jobs: Job[];
};
