import { computed } from '@angular/core';
import { Form, FormValue } from 'formal';
import { defineFormState } from '../form-state';
import { ValidationError, Validator } from './validator';

const [readState, stateFactory] = defineFormState('validations', {
  default: [],
  createState: <T extends FormValue>(
    form: Form<T>,
    ...validators: Validator<any>[]
  ) => {
    return computed(() =>
      validators
        .map((validator) => {
          return validator(form);
        })
        .filter((error): error is ValidationError => error !== null),
    );
  },
});

export function withValidators<T extends FormValue>(
  ...validators: Validator<T>[]
) {
  return stateFactory<T, Validator<T>[]>(...validators);
}

export function validationErrors(form: Form) {
  return readState(form);
}
