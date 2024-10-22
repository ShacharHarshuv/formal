import { ReadonlyForm } from '../../form';
import { validationErrors } from './with-validators';

export function isInvalid(form: ReadonlyForm) {
  return validationErrors(form).length !== 0;
}
