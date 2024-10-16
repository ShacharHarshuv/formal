import { Form, FormValue } from 'formal';
import { RecordFormValue } from '../form';

export function isRecordForm<T extends FormValue>(
  form: Form<T>,
): // @ts-ignore
form is Form<T extends RecordFormValue ? T : never> {
  return 'fields' in form && !Array.isArray(form.fields());
}
