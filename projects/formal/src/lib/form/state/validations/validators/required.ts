import { ValidationFn } from '../validator';

export function required(errorMessage: string = ''): ValidationFn {
  return function (form) {
    return form() ? null : errorMessage;
  };
}
