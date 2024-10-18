import { ValidationFn } from 'formal';

export function min(
  min: number,
  errorMessage: string = '',
): ValidationFn<number> {
  return function (form) {
    if (form() === null || form() === undefined) {
      return null;
    }

    return form() < min ? errorMessage : null;
  };
}
