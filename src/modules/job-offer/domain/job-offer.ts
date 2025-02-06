import { Option, some, none } from 'fp-ts/Option';
import {
  NonEmptyString,
  NonEmptyStringArray,
  PositiveNumber,
  StrictBoolean,
  ValidDate,
} from 'src/common/types';
import { Brand } from 'src/common/types/brand';
import { z } from 'zod';

export type JobOffer = JobOffer.Base;
export namespace JobOffer {
  export type Base = {
    jobId: NonEmptyString;
    title: NonEmptyString;
    location: NonEmptyString;
    salaryMin: Salary.Min;
    salaryMax: Salary.Max;
    postedDate: ValidDate;
    skills: SkillSet;
    isRemote: StrictBoolean;
  };

  export namespace Salary {
    export type Min = Brand<number, 'salaryMin'>;
    export type Max = Brand<number, 'salaryMax'>;

    const checkPositivity = (min: number, max: number) =>
      PositiveNumber.is(min) && PositiveNumber.is(max);

    export const isMin = (min: number, max: number): min is Min =>
      checkPositivity(min, max) && min <= max;
    export const isMax = (min: number, max: number): max is Max =>
      checkPositivity(min, max) && min <= max;

    export const is = (min: number, max: number): boolean =>
      isMin(min, max) && isMax(min, max);

    export const mk = (min: number, max: number): Option<[Min, Max]> =>
      isMin(min, max) && isMax(min, max) ? some([min, max]) : none;
    
    export const mkUnsafe = (min: number, max: number) => {
      if (isMin(min, max) && isMax(min, max)) return [min, max] as const;
      throw Error('Invalid salary range.');
    };
  }

  export type SkillSet = SkillSet.Type;
  export namespace SkillSet {
    export type Type = Brand<Array<string>, 'SkillSet'>;

    export const is = (value: string[]): value is SkillSet =>
      [...new Set(value)].length == value.length &&
      value.every((item) => item.trim().length > 0);

    export const mk = (value: string[]): Option<SkillSet> =>
      is(value) ? some(value) : none;

    export const mkUnsafe = (value: string[]): SkillSet => {
      if (is(value)) return value;
      throw new Error('Invalid Skill Set');
    };
  }

  const jobOfferSchema = z
    .object({
      jobId: z.string().refine(NonEmptyString.is, { message: 'Invalid jobId' }),
      title: z.string().refine(NonEmptyString.is, { message: 'Invalid title' }),
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
    skills: Array<string>;
    isRemote: boolean;
  }): JobOffer => {
    const validatedData = jobOfferSchema.parse(data) as Required<
      z.infer<typeof jobOfferSchema>
    >;
    const [salaryMin, salaryMax] = Salary.mkUnsafe(
      validatedData.salaryMin,
      validatedData.salaryMax,
    );
    const skills = SkillSet.mkUnsafe([...new Set(validatedData.skills)]);

    return {
      ...validatedData,
      salaryMax,
      salaryMin,
      skills,
    };
  };
}
