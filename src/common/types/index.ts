import { Option, none, some } from 'fp-ts/Option';
import { Brand } from './brand';

export * from './brand';

export type NonEmptyString = NonEmptyString.Type;
export namespace NonEmptyString {
  export type Type = Brand<string, 'NonEmptyString'>;
  export const is = (value: string): value is NonEmptyString =>
    value.trim().length > 0;
  export const mk = (value: string): Option<NonEmptyString> =>
    is(value) ? some(value) : none;
  export const mkUnsafe = (value: string) => {
    if (!is(value)) throw new Error('Invalid NonEmptyString');
    return value;
  };
}

export type UUID = UUID.Type;
export namespace UUID {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  export type Type = Brand<string, 'UUID'>;
  export const is = (value: string): value is UUID => uuidRegex.test(value);
  export const mk = (value: string): Option<UUID> =>
    is(value) ? some(value) : none;
  export const mkUnsafe = (value: string) => {
    if (!is(value)) throw new Error('Invalid UUID');
    return value;
  };
}

export type NonEmptyStringArray = NonEmptyStringArray.Type;
export namespace NonEmptyStringArray {
  export type Type = Brand<string[], 'NonEmptyStringArray'>;
  export const is = (value: string[]): value is NonEmptyStringArray =>
    value.every((item) => item.trim().length > 0);
  export const mk = (value: string[]): Option<NonEmptyStringArray> =>
    is(value) ? some(value) : none;
  export const mkUnsafe = (value: string[]) => {
    if (!is(value)) throw new Error('Invalid NonEmptyString');
    return value;
  };
}

export type PositiveNumber = PositiveNumber.Type;
export namespace PositiveNumber {
  export type Type = Brand<number, 'PositiveNumber'>;
  export const is = (value: number): value is PositiveNumber => value > 0;
  export const mk = (value: number): Option<PositiveNumber> =>
    is(value) ? some(value) : none;
  export const mkUnsafe = (value: number) => {
    if (!is(value)) throw new Error('Invalid PositiveNumber');
    return value;
  };
}

export type NonNegativeNumber = NonNegativeNumber.Type;
export namespace NonNegativeNumber {
  export type Type = Brand<number, 'NonNegativeNumber'>;
  export const is = (value: number): value is NonNegativeNumber => value >= 0;
  export const mk = (value: number): Option<NonNegativeNumber> =>
    is(value) ? some(value) : none;
  export const mkUnsafe = (value: number) => {
    if (!is(value)) throw new Error('Invalid NonNegativeNumber');
    return value;
  };
}

export type ValidDate = ValidDate.Type;
export namespace ValidDate {
  export type Type = Brand<Date, 'ValidDate'>;
  export const is = (value: Date): value is ValidDate =>
    value instanceof Date && !isNaN(value.getTime());
  export const mk = (value: Date): Option<ValidDate> =>
    is(value) ? some(value as ValidDate) : none;
  export const mkUnsafe = (value: Date) => {
    if (!is(value)) throw new Error('Invalid Date');
    return value;
  };
}

export type StrictBoolean = StrictBoolean.Type;
export namespace StrictBoolean {
  export type Type = Brand<boolean, 'StrictBoolean'>;
  export const is = (value: boolean): value is StrictBoolean =>
    typeof value === 'boolean';
  export const mk = (value: boolean): Option<StrictBoolean> =>
    is(value) ? some(value as StrictBoolean) : none;
  export const mkUnsafe = (value: boolean) => {
    if (!is(value)) throw new Error('Invalid StrictBoolean');
    return value;
  };
}
