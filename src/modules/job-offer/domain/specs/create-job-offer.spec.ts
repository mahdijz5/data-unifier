import { CreateJobOffer } from '../create-job-offer';
import { JobOffer } from '../job-offer';

describe('CreateJobOffer Domain', () => {
  it('should create a valid job offer', () => {
    const jobOffer = CreateJobOffer.mk({
      jobId: '1234',
      title: 'Software Engineer',
      location: 'New York',
      salaryMin: 60000,
      salaryMax: 120000,
      postedDate: new Date(),
      skills: ['TypeScript', 'NestJS'],
      isRemote: true,
      workTime: JobOffer.WorkTime.Options[0],
      company: {
        name: 'Tech Corp',
        industry: 'IT',
        website: 'https://techcorp.com',
      },
    });

    expect(jobOffer).toBeDefined();
    expect(jobOffer.company.name).toBe('Tech Corp');
  });

  it('should throw an error for invalid salary range', () => {
    expect(() =>
      CreateJobOffer.mk({
        jobId: '1234',
        title: 'Software Engineer',
        location: 'New York',
        salaryMin: -5000,
        salaryMax: 120000,
        postedDate: new Date(),
        skills: ['TypeScript', 'NestJS'],
        isRemote: true,
        workTime: 'Full-Time' as JobOffer.WorkTime,
        company: {
          name: 'Tech Corp',
          industry: 'IT',
          website: 'https://techcorp.com',
        },
      }),
    ).toThrow();
  });
});
