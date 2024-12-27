import { Form } from '../../form';
import { PENDING_VALIDATION } from './validator';
import { validationStates } from './with-validators';

export function isPending(form: Form) {
  return validationStates(form).some((state) => state === PENDING_VALIDATION);
}
