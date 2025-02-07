import { none, some } from 'fp-ts/Option';
import { z } from 'zod';

export const OptionSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z
    .union([schema, z.undefined(), z.null()])
    .transform((value) => (value !== undefined ? some(value) : none));
