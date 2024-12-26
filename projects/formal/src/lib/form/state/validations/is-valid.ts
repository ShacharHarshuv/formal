import { Form } from '../../form';
import { validationStates } from './with-validators';

export function isValid(form: Form) {
  return validationStates(form).filter((value) => value !== null).length === 0;
}
