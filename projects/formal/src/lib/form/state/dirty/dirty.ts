import { dirtyOrTouchedFormState } from '../dirty-or-touched-form-state';

export const [isDirty, setIsDirty] = dirtyOrTouchedFormState('dirty');
