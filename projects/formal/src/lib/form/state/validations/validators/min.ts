import { ValidationFn } from 'formal';

export function min<T extends number | undefined | null | ''>(
  min: number,
  errorMessage: string = '',
): ValidationFn<T> {
  return function (form) {
    const value: number | undefined | null | '' = form();
    if (value === null || value === undefined || value === '') {
      return null;
    }

    return value < min ? errorMessage : null;
  };
}
