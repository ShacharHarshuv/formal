import { Signal } from '@angular/core';
import { ValidatorFn as NgValidatorFn } from '@angular/forms';
import { FormValue, ReadonlyForm } from '../../form';

export type ValidationError =
  | string
  | {
      [key: string]: unknown;
      toString?: () => string;
    };
// will be run in reactive context
export type ValidationFn<Value extends FormValue = FormValue> = ((
  form: ReadonlyForm<Value>,
) => ValidationError | null) & {
  /**
   * Used for backward compatibility to Angular reactive forms, in implementation like Angular Material, where required indication is explicitly looking for the ReactiveForms' built-in validator
   * */
  pseudoNgValidation?: NgValidatorFn;
};
export type Validator<Value extends FormValue = FormValue> =
  | ValidationFn<Value>
  | (Signal<ValidationError> & {
      pseudoNgValidation?: undefined;
    });
