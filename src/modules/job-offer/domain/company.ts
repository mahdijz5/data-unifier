import { Option } from 'fp-ts/Option';
import { NonEmptyString, UUID } from 'src/common/types';
import { OptionSchema } from 'src/common/validation';
import { z } from 'zod';

export type Company = Company.Base;
export namespace Company {
  export type Base = {
    id: UUID;
    name: NonEmptyString;
    industry: Option<NonEmptyString>;
    website: Option<NonEmptyString>;
  };

  const companySchema = z.object({
    id: z.string().uuid().refine(UUID.is, { message: 'Invalid UUID' }),
    name: z.string().refine(NonEmptyString.is, { message: 'Invalid Name' }),
    industry: OptionSchema(
      z
        .string()
        .refine(NonEmptyString.is, { message: 'Invalid Industry' })
        .optional(),
    ),
    website: OptionSchema(
      z
        .string()
        .refine(NonEmptyString.is, { message: 'Invalid Website' })
        .optional(),
    ),
  });

  export const mk = (data: {
    id: string;
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
