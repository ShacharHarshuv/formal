import { Form, FormValue } from 'formal';
import { map } from 'lodash';
import { ArrayFormValue, PrimitiveFormValue, ReadonlyForm } from '../form';

export interface FieldDescriptor<
  T extends FormValue,
  Key extends string | number = string | number,
> {
  form: Form<T>;
  position: Key;
}

export function fieldsDescriptors<T extends FormValue>(
  form: ReadonlyForm<T>,
): T extends PrimitiveFormValue
  ? []
  : T extends ArrayFormValue
    ? FieldDescriptor<T[number], number>[]
    : FieldDescriptor<
        // @ts-ignore
        T[keyof T],
        keyof T
      >[] {
  if (!form.fields) {
    // @ts-ignore
    return [];
  }

  const fields = form.fields();

  if (Array.isArray(fields)) {
    // @ts-ignore
    return fields.map((form, index) => ({ form: form, position: index }));
  }

  // @ts-ignore
  return map(fields, (form, position) => ({ form: form as Form, position }));
}
