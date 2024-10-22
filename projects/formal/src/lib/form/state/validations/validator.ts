import { Signal } from '@angular/core';
import { ValidatorFn as NgValidatorFn } from '@angular/forms';
import { FormValue, ReadonlyForm } from '../../form';

export type ValidationError =
  | string
  | {
      [key: string]: unknown;
      toString?: () => string;
    };

const NEVER_SYMBOL = Symbol('');
// will be run in reactive context
export type ValidationFn<
  Value extends FormValue = FormValue,
  Valid extends Value = Value,
> = {
  (form: ReadonlyForm<Value>): ValidationError | null;
  /**
   * Used for backward compatibility to Angular reactive forms, in implementation like Angular Material, where required indication is explicitly looking for the ReactiveForms' built-in validator
   * */
  pseudoNgValidation?: NgValidatorFn;
  [NEVER_SYMBOL]?: {
    set: (value: Valid) => void;
    get: Valid;
  };
};
export type Validator<
  Value extends FormValue = FormValue,
  Valid extends Value = Value,
> =
  | ValidationFn<Value, Valid>
  | (Signal<ValidationError> & {
      pseudoNgValidation?: undefined;
    });
