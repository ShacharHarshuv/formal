import { computed } from '@angular/core';
import { FormValue } from 'formal';
import { ReadonlyForm, StateFactory } from '../../form';
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
        readValidations(form)
          .map((validator) => {
            return validator(form);
          })
          .filter((error): error is ValidationError => error !== null),
      );
    },
  },
);

type TupleIntersection<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First & TupleIntersection<Rest>
  : unknown;

export function withValidators<T extends FormValue, TValids extends T[]>(
  ...validators: { [K in keyof TValids]: Validator<T, TValids[K]> }
): StateFactory<T, TupleIntersection<TValids> & T> {
  return (form) => {
    validationsStateFactory(...(validators as Validator[]))(form);
    validationErrorsFactory<T, []>()(form);
  };
}

export function ownValidationErrors(form: ReadonlyForm) {
  return readErrors(form);
}

export function validationErrors(form: ReadonlyForm): ValidationError[] {
  const ownErrors = ownValidationErrors(form);
  const children = fieldsDescriptors(form);
  const childrenErrors = children.map(({ form }) => validationErrors(form));

  return [...ownErrors, ...childrenErrors.flat()];
}
