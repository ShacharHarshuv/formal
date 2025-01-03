import { Form } from '../../form';
import { validationErrors } from './with-validators';

export function isInvalid(form: Form) {
  return validationErrors(form).length !== 0;
}
