import { Form } from 'formal';
import { validationErrors } from './with-validators';

export function isValid(form: Form) {
  return validationErrors(form).length === 0;
}
