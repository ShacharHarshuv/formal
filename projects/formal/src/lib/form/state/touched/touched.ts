import { dirtyOrTouchedFormState } from '../dirty-or-touched-form-state';

export const [isTouched, setIsTouched] = dirtyOrTouchedFormState('touched');
