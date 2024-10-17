import { computed } from '@angular/core';
import { Form, FormValue } from 'formal';
import { fieldsDescriptors } from '../../public-utility/fields-descriptors';
import { defineFormState } from '../form-state';
import { ValidationError, Validator } from './validator';

const [readValidations, validationsStateFactory] = defineFormState(
  'validations',
  {
    default: [],
    createState: (form: Form, ...validators: Validator[]) => {
      return computed(() => validators);
    },
  },
);

export function validators<T extends FormValue>(form: Form<T>): Validator<T>[] {
  return readValidations(form);
}

const [readErrors, validationErrorsFactory] = defineFormState(
  'validationErrors',
  {
    default: [],
    createState: <T extends FormValue>(form: Form<T>) => {
      return computed(() =>
        readValidations(form)
          .map((validator) => {
            return validator(form);
          })
          .filter((error): error is ValidationError => error !== null),
      );
    },
  },
);

export function withValidators<T extends FormValue>(
  ...validators: Validator<T>[]
) {
  return (form: Form<T>) => {
    validationsStateFactory(...(validators as Validator[]))(form);
    validationErrorsFactory<T, []>()(form);
  };
}

export function ownValidationErrors(form: Form) {
  return readErrors(form);
}

export function validationErrors(form: Form): ValidationError[] {
  const ownErrors = ownValidationErrors(form);
  const children = fieldsDescriptors(form);
  const childrenErrors = children.map(({ form }) => validationErrors(form));

  return [...ownErrors, ...childrenErrors.flat()];
}
