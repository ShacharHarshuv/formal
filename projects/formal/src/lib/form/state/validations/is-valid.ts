import { ReadonlyForm } from '../../form';
import { validationStates } from './with-validators';

export function isValid(form: ReadonlyForm) {
  return validationStates(form).filter((value) => value !== null).length === 0;
}
