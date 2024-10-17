import { Validators } from '@angular/forms';
import { Form } from '../../../form';
import { ValidationFn } from '../validator';
import { validators } from '../with-validators';

export function required(errorMessage: string = ''): ValidationFn {
  const validator: ValidationFn = function (form) {
    return form() ? null : errorMessage;
  };
  validator.pseudoNgValidation = Validators.required;
  return validator;
}

export function isRequired(form: Form) {
  return validators(form).some(
    (validator) => validator.pseudoNgValidation === Validators.required,
  );
}
