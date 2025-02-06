import { Option, some, none } from 'fp-ts/Option';
import { NonEmptyString } from 'src/common/types';
import { z } from 'zod';

export type Company = Company.Base;
export namespace Company {
  export type Base = {
    name: NonEmptyString;
    industry: Option<NonEmptyString>;
    website: Option<NonEmptyString>;
  };

  const OptionSchema = <T extends z.ZodTypeAny>(schema: T) =>
    z
      .union([schema, z.undefined()])
      .transform((value) => (value !== undefined ? some(value) : none));

  const companySchema = z.object({
    name: z.string().refine(NonEmptyString.is, { message: 'Invalid jobId' }),
    industry: OptionSchema(
      z
        .string()
        .refine(NonEmptyString.is, { message: 'Invalid title' })
        .optional(),
    ),
    website: OptionSchema(
      z
        .string()
        .refine(NonEmptyString.is, { message: 'Invalid location' })
        .optional(),
    ),
  });

  export const mk = (data: {
    name: string;
    industry?: string;
    website?: string;
  }) => {
    const validatedData = companySchema.parse(data) as Required<
      z.infer<typeof companySchema>
    >;
    return validatedData;
  };
}
