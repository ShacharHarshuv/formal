import { PENDING_VALIDATION, validationStates } from 'formal';
import { Form } from '../../form';

export function isPending(form: Form) {
  return validationStates(form).some((state) => state === PENDING_VALIDATION);
}
