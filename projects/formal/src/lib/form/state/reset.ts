import { FormValue, setIsDirty, WritableForm } from 'formal';
import { setIsTouched } from './touched/touched';

export function reset<T extends FormValue>(form: WritableForm<T>, value: T) {
  form.set(value);
  setIsDirty(form, false);
  setIsTouched(form, false);
}
