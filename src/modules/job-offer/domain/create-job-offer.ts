import { NonEmptyString, StrictBoolean, ValidDate } from 'src/common/types';
import { z } from 'zod';
import { CreateCompany } from './create-company';
import { JobOffer } from './job-offer';

export type CreateJobOffer = CreateJobOffer.Base;
export namespace CreateJobOffer {
  export type Base = {
    jobId: NonEmptyString;
    title: NonEmptyString;
    location: NonEmptyString;
    salaryMin: JobOffer.Salary.Min;
    salaryMax: JobOffer.Salary.Max;
    postedDate: ValidDate;
    skills: JobOffer.SkillSet;
    isRemote: StrictBoolean;
    company: CreateCompany;
    workTime: JobOffer.WorkTime;
  };

  const jobOfferSchema = z
    .object({
      jobId: z.string().refine(NonEmptyString.is, { message: 'Invalid jobId' }),
      title: z.string().refine(NonEmptyString.is, { message: 'Invalid title' }),
      workTime: z
        .string()
        .refine(JobOffer.WorkTime.is, { message: 'Invalid WorkTime' }),
      location: z
        .string()
        .refine(NonEmptyString.is, { message: 'Invalid location' }),
      salaryMin: z.number().positive(),
      salaryMax: z.number().positive(),
      postedDate: z
        .date()
        .refine(ValidDate.is, { message: 'Invalid postedDate' }),
      skills: z.array(z.string()),
      isRemote: z
        .boolean()
        .refine(StrictBoolean.is, { message: 'Invalid isRemote' }),
    })
    .required();

  export const mk = (data: {
    jobId: string;
    title: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    postedDate: Date;
    skills: string[];
    isRemote: boolean;
    workTime: JobOffer.WorkTime;
    company: {
      name: string;
      industry?: string;
      website?: string;
    };
  }): CreateJobOffer => {
    const validatedData = jobOfferSchema.parse(data) as Required<
      z.infer<typeof jobOfferSchema>
    >;
    const [salaryMin, salaryMax] = JobOffer.Salary.mkUnsafe(
      validatedData.salaryMin,
      validatedData.salaryMax,
    );
    const skills = JobOffer.SkillSet.mkUnsafe([
      ...new Set(validatedData.skills),
    ]);
    const company = CreateCompany.mk(data.company);

    return { ...validatedData, salaryMin, salaryMax, skills, company };
  };
}
