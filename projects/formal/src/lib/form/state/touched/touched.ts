import { Form } from '../../form';
import { dirtyOrTouchedFormState } from '../dirty-or-touched-form-state';

export const [isTouched, setIsTouched] = dirtyOrTouchedFormState('touched');

export function isUntouched(form: Form) {
  return !isTouched(form);
}
