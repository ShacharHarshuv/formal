import { Signal } from '@angular/core';
import { Form, FormValue } from '../../form';

export type ValidationError =
  | string
  | {
      [key: string]: unknown;
      toString?: () => string;
    };
// will be run in reactive context
export type ValidationFn<Value extends FormValue = FormValue> = (
  form: Form<Value>,
) => ValidationError | null;
export type Validator<Value extends FormValue = FormValue> =
  | ValidationFn<Value>
  | Signal<ValidationError>;
