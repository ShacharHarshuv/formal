import { Form } from '../../form';
import { dirtyOrTouchedFormState } from '../dirty-or-touched-form-state';

export const [isDirty, setIsDirty] = dirtyOrTouchedFormState('dirty');

export function isPristine(form: Form) {
  return !isDirty(form);
}
