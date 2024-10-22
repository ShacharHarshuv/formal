import { computed } from '@angular/core';
import { FormValue, PENDING_VALIDATION, ValidationState } from 'formal';
import { ReadonlyForm } from '../../form';
import { fieldsDescriptors } from '../../public-utility/fields-descriptors';
import { defineFormState } from '../form-state';
import { ValidationError, Validator } from './validator';

const [readValidations, validationsStateFactory] = defineFormState(
  'validations',
  {
    default: [],
    createState: (form: ReadonlyForm, ...validators: Validator[]) => {
      return computed(() => validators);
    },
  },
);

export function validators<T extends FormValue>(
  form: ReadonlyForm<T>,
): Validator<T>[] {
  return readValidations(form);
}

const [readErrors, validationErrorsFactory] = defineFormState(
  'validationErrors',
  {
    default: [],
    createState: <T extends FormValue>(form: ReadonlyForm<T>) => {
      return computed(() =>
        readValidations(form).map((validator) => {
          return validator(form);
        }),
      );
    },
  },
);

export function withValidators<T extends FormValue>(
  ...validators: Validator<T>[]
) {
  return (form: ReadonlyForm<T>) => {
    validationsStateFactory(...(validators as Validator[]))(form);
    validationErrorsFactory<T, []>()(form);
  };
}

export function ownValidationStates(form: ReadonlyForm) {
  return readErrors(form);
}

export function validationStates(form: ReadonlyForm): ValidationState[] {
  const ownErrors = ownValidationStates(form);
  const children = fieldsDescriptors(form);
  const childrenErrors = children.map(({ form }) => validationErrors(form));

  return [...ownErrors, ...childrenErrors.flat()];
}

function isError(state: ValidationState): state is ValidationError {
  return state !== null && state !== PENDING_VALIDATION;
}

export function ownValidationErrors(form: ReadonlyForm) {
  return ownValidationStates(form).filter(isError);
}
export function validationErrors(form: ReadonlyForm) {
  return validationStates(form).filter(isError);
}
