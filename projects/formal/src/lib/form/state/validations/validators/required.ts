import { Validators } from '@angular/forms';
import { FormValue, ReadonlyForm } from '../../../form';
import { ValidationError, ValidationFn } from '../validator';
import { validators } from '../with-validators';

type RequiredValidationFn<T extends FormValue> = ValidationFn<
  T,
  Exclude<T, null | undefined>
>;

/**
 * The elaborate return type ensures that the required validator is used only when the type of
 * the form value could result in an invalid value, otherwise it's probably a mistake
 * */
export function required(errorMessage: string = ''): /*null extends T
 ? RequiredValidationFn<T>
 : undefined extends T
 ? RequiredValidationFn<T>
 : '' extends T
 ? RequiredValidationFn<T>
 : null*/ <T extends FormValue>(
  form: ReadonlyForm<T, Exclude<T, null | undefined>>,
) => ValidationError | null {
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
