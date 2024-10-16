import { ArrayFormValue, Form, FormValue } from '../form';

export function isArrayForm<T extends FormValue>(
  form: Form<T>,
): // @ts-ignore
form is Form<T extends ArrayFormValue ? T : never> {
  return 'fields' in form && Array.isArray(form.fields());
}
