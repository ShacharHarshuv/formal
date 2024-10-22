import { Form, FormValue, ReadonlyForm } from '../../form';
import { isValid } from './is-valid';

export function validValueOrThrow<T extends FormValue, TValid extends T>(
  form: Form<T, TValid> | ReadonlyForm<T, TValid>,
) {
  if (!isValid(form)) {
    throw new Error('Form is not valid');
  }
  return form() as TValid;
}
