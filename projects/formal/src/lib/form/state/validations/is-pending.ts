import { PENDING_VALIDATION, validationStates } from 'formal';
import { ReadonlyForm } from '../../form';

export function isPending(form: ReadonlyForm) {
  return validationStates(form).some((state) => state === PENDING_VALIDATION);
}
