import { validationErrors } from 'formal';
import { ReadonlyForm } from '../../form';

export function isInvalid(form: ReadonlyForm) {
  return validationErrors(form).length !== 0;
}
