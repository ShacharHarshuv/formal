import { Form, FormValue, setIsDirty } from 'formal';

export function reset<T extends FormValue>(form: Form<T>, value: T) {
  form.set(value);
  setIsDirty(form, false);
}
