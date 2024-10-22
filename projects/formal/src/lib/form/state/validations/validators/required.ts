import { Validators } from '@angular/forms';
import { FormValue, ReadonlyForm } from '../../../form';
import { ValidationFn } from '../validator';
import { validators } from '../with-validators';

/**
 * The elaborate return type ensures that the required validator is used only when the type of
 * the form value could result in an invalid value, otherwise it's probably a mistake
 * */
export function required<T extends FormValue>(
  errorMessage: string = '',
): null extends T
  ? ValidationFn<T>
  : undefined extends T
    ? ValidationFn<T>
    : '' extends T
      ? ValidationFn<T>
      : null {
  const validator: ValidationFn = function (form) {
    return form() ? null : errorMessage;
  };
  validator.pseudoNgValidation = Validators.required;
  // @ts-ignore
  return validator;
}

export function isRequired(form: ReadonlyForm) {
  return validators(form).some(
    (validator) => validator.pseudoNgValidation === Validators.required,
  );
}
