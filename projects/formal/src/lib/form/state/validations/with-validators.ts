import { computed, signal, Signal, untracked } from '@angular/core';
import { FormValue, PENDING_VALIDATION, ValidationState } from 'formal';
import { Form } from '../../form';
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
    createState: <T extends FormValue>(
      form: Form<T>,
    ): Signal<ValidationState[]> => {
      const validations = readValidations(form); // validations are static and don't depend on the form, so they don't need to be inside a computed

      const validationStates: Signal<ValidationState>[] = validations.map(
        (validator) => {
          let lastPromise: Promise<unknown> | undefined;
          let lastPromiseValue: Signal<ValidationState> | undefined;
          let lastAbortController: AbortController | undefined;

          const validatorResult = computed(() => {
            lastAbortController?.abort();

            lastPromise = undefined;
            lastPromiseValue = undefined;

            lastAbortController = new AbortController();
            return validator(form, lastAbortController.signal);
          });

          return computed(() => {
            const result = validatorResult();

            if (result instanceof Promise) {
              const promiseValue =
                lastPromise === result
                  ? lastPromiseValue!
                  : untracked(() => {
                      lastPromise = result;
                      const promiseValue =
                        signal<ValidationState>(PENDING_VALIDATION);
                      result
                        .catch((error): ValidationState => {
                          lastPromise = undefined;
                          lastPromiseValue = undefined;
                          console.error(error);
                          return PENDING_VALIDATION;
                        })
                        .then((state) => {
                          promiseValue.set(state);
                        });
                      lastPromiseValue = promiseValue;
                      return promiseValue;
                    });

              if (promiseValue() !== PENDING_VALIDATION) {
                lastPromise = undefined;
                lastPromiseValue = undefined;
              }

              return promiseValue();
            } else {
              return result;
            }
          });
        },
      );

      return computed(() => validationStates.map((state) => state()));
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

export function ownValidationStates(form: Form) {
  return readErrors(form);
}

export function validationStates(form: Form): ValidationState[] {
  const ownErrors = ownValidationStates(form);
  const children = fieldsDescriptors(form);
  const childrenErrors = children.map(({ form }) => validationErrors(form));

  return [...ownErrors, ...childrenErrors.flat()];
}

function isError(state: ValidationState): state is ValidationError {
  return state !== null && state !== PENDING_VALIDATION;
}

export function ownValidationErrors(form: Form) {
  return ownValidationStates(form).filter(isError);
}
export function validationErrors(form: Form) {
  return validationStates(form).filter(isError);
}
