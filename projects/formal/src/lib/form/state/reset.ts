import { FormValue, WritableForm } from '../form';
import { setIsDirty } from './dirty/dirty';
import { setIsTouched } from './touched/touched';

export function reset<T extends FormValue>(form: WritableForm<T>, value: T) {
  form.set(value);
  setIsDirty(form, false);
  setIsTouched(form, false);
}
