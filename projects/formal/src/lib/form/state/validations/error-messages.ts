import { Form } from 'formal';
import { validationErrors } from './with-validators';

export function errorMessages(form: Form) {
  return validationErrors(form)
    .map((error) => {
      if (!error) {
        return null;
      }

      if (typeof error === 'string' && error.length > 0) {
        return error;
      }

      if (
        typeof error === 'object' &&
        error.toString !== Object.prototype.toString
      ) {
        return error.toString!();
      }

      return null;
    })
    .filter((error) => error !== null);
}
