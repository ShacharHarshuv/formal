import { Form, FormValue, setIsDirty } from 'formal';
import { setIsTouched } from './touched/touched';

export function reset<T extends FormValue>(form: Form<T>, value: T) {
  form.set(value);
  setIsDirty(form, false);
  setIsTouched(form, false);
}
