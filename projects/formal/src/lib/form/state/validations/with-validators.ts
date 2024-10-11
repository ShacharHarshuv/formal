import { computed } from '@angular/core';
import { defineFormState } from '../form-state';
import { ValidationError, Validator } from './validator';

export const [validationErrors, withValidators] = defineFormState(
  'validations',
  {
    default: [],
    createState: (form, ...validators: Validator[]) => {
      // todo: we need to type validators so they can only be used where they will work type-wise
      return computed(() =>
        validators
          .map((validator) => {
            return validator(form);
          })
          .filter((error): error is ValidationError => error !== null),
      );
    },
  },
);
