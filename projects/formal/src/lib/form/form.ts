import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { OptionalKeys, RequiredKeys } from 'expect-type';
import { mapValues, omit } from 'lodash';

type PrimitiveFormValue = string | number | boolean | null | undefined;

type RecordFormValue = {
  [K: string | number]: FormValue;
};

type ArrayFormValue = FormValue[];

export type FormValue = PrimitiveFormValue | RecordFormValue | ArrayFormValue;

/**
 * @Internal
 * */
export const FORM = Symbol('FORM');

export type Form<T extends FormValue = FormValue> = WritableSignal<T> & {
  [FORM]: unknown;
} & (T extends Array<infer U>
    ? {
        // @ts-ignore
        fields: Signal<readonly Form<U>[]>;
      }
    : T extends object
      ? {
          fields: Signal<
            // @ts-ignore
            { readonly [K in RequiredKeys<T>]: Form<T[K]> } & {
              // @ts-ignore
              readonly [K in OptionalKeys<T>]?: Form<Required<T>[K]>;
            }
          >;
        }
      : {});

type FormOrValue<T extends FormValue = FormValue> = Form<T> | T;

type ArrayFormInit<T extends FormValue = FormValue> = FormOrValue<T>[];

type RecordFormInit = { [K: string | number]: FormOrValue };

type FormInit = PrimitiveFormValue | ArrayFormInit | RecordFormInit;

type FormInitFromValue<T extends FormValue = FormValue> = T extends Array<
  infer U
>
  ? // @ts-ignore
    ArrayFormInit<U>
  : T extends RecordFormValue
    ? // @ts-ignore
      { [K in RequiredKeys<T>]: FormOrValue<T[K]> } & {
        // @ts-ignore
        [K in OptionalKeys<T>]?: FormOrValue<Required<T>[K]>;
      }
    : T;

type FormValueFromInit<T extends FormInit> = T extends PrimitiveFormValue
  ? T
  : T extends ArrayFormInit<infer U>
    ? U[]
    : T extends RecordFormInit
      ? { [K in RequiredKeys<T>]: T[K] extends Form<infer U> ? U : T[K] } & {
          [K in OptionalKeys<T>]?: Required<T>[K] extends Form<infer U>
            ? U
            : Required<T>[K];
        }
      : never;

function formArray<T extends FormValue>(initialValue: FormOrValue<T>[]) {
  const initialFields = initialValue.map((value) => toForm(value));
  const fields = signal(initialFields);

  const value = computed(() => fields().map((field) => field()));

  const set = (value: T[]) => {
    if (!Array.isArray(value)) {
      throw new Error(
        `Cannot set a form with fields to a primitive value (${value})`,
      );
    }

    let newFields = fields();
    if (newFields.length !== value.length) {
      newFields = [...newFields];
      newFields.length = value.length;
    }

    for (let i = 0; i < value.length; i++) {
      if (!newFields[i]) {
        newFields[i] = form(value[i]);
      } else {
        newFields[i].set(value[i]);
      }
    }

    fields.set(newFields);
  };

  return {
    value,
    set,
    fields,
  };
}

function isForm<T extends FormValue>(
  formOrValue: FormOrValue<T>,
): formOrValue is Form<T> {
  return (
    ((formOrValue != null && typeof formOrValue === 'object') ||
      typeof formOrValue === 'function') &&
    FORM in formOrValue
  );
}

function toForm<T extends FormValue>(formOrValue: FormOrValue<T>): Form<T> {
  return isForm(formOrValue) ? formOrValue : form<T>(formOrValue as T);
}

function formRecord<
  T extends {
    [K: string | number]: FormValue;
  },
>(initialValue: { [K in keyof T]: FormOrValue<T[K]> }) {
  const initialFields = mapValues(initialValue, (value) => toForm(value)) as {
    [K in keyof T]: Form<T[K] & FormValue>;
  };
  const fields = signal(initialFields);

  const value = computed((): T => {
    return mapValues(fields(), (field) => field()) as T;
  });

  const set = (value: T) => {
    if (typeof value !== 'object' || value === null) {
      // TODO: consider supporting this case
      throw new Error(
        `Cannot set a form with fields to a primitive value (${value})`,
      );
    }

    const currentFields = fields();
    const missingFields: { [key: string]: any } = {};

    for (const key in value) {
      if (!(key in currentFields)) {
        // @ts-ignore
        missingFields[key] = form(value[key]);
        continue;
      }

      // @ts-ignore
      currentFields[key].set(value[key]);
    }

    const keysToRemove = [];
    for (const key in currentFields) {
      if (!(key in value)) {
        keysToRemove.push(key);
      }
    }

    // avoid changing reference if we don't need to
    if (Object.keys(missingFields).length === 0 && !keysToRemove.length) {
      return;
    }

    // @ts-ignore
    fields.set({
      ...omit(currentFields, keysToRemove),
      ...missingFields,
    });
  };

  return {
    value,
    set,
    fields,
  };
}

/**
 * @internal
 * */
export type StateFactory<T extends FormValue = FormValue> = (
  form: Form<T>,
) => void;

export function form(
  initialValue: string,
  states?: StateFactory<string>[],
): Form<string>;
export function form(
  initialValue: number,
  states?: StateFactory<number>[],
): Form<number>;
export function form(
  initialValue: boolean,
  states?: StateFactory<boolean>[],
): Form<boolean>;
// to conserve the type name in the simple case where the input type could also be used as a value directly
export function form<T extends FormValue>(
  initialValue: T,
  states?: StateFactory<T>[],
): Form<T>;
// These overload is used for generic inference only, and is not meant to be manually passed by consumers
export function form<T extends FormInit, Dummy extends never>(
  initialValue: T,
  states?: StateFactory<FormValueFromInit<T>>[],
): Form<FormValueFromInit<T>>;
// this overload is used for explicitly passing the form value to the generic
export function form<T extends FormValue>(
  initialValue: T | FormInitFromValue<T>,
  states?: StateFactory<T>[],
): Form<T>;
export function form<T extends FormValue>(
  initialValue: FormInitFromValue<T>,
  states: StateFactory<T>[] = [],
): Form<T> {
  const _form = (() => {
    if (typeof initialValue !== 'object' || initialValue === null) {
      return signal(initialValue) as any; // not sure why type inference didn't work as expected here
    }

    const { value, set, fields } = Array.isArray(initialValue)
      ? formArray(initialValue)
      : formRecord(initialValue);

    const update = (updater: (value: T) => T) => {
      // @ts-ignore
      set(updater(value()));
    };

    return Object.assign(value, {
      set,
      update,
      fields,
    }) as unknown as Form<T>;
  })();

  _form[FORM] = {};

  states.forEach((state) => state(_form));

  return _form;
}
