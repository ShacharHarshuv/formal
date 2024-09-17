import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { mapValues } from 'lodash';

type Primitive = string | number | boolean | null | undefined;

export type FormValue =
  | Primitive
  | {
      [K: string]: FormValue;
      [K: number]: FormValue;
    }
  | FormValue[];

export type Form<T extends FormValue> = WritableSignal<T> &
  (T extends Array<infer U>
    ? {
        // @ts-ignore
        fields: Signal<Form<U>[]>;
      }
    : T extends object
      ? {
          // @ts-ignore
          fields: Signal<{ [K in keyof T]: Form<T[K]> }>;
        }
      : {});

function formArray<T extends FormValue>(initialValue: T[]) {
  const initialFields = initialValue.map((value) => form(value));
  const fields = signal(initialFields);

  const value = computed(() => fields().map((field) => field()));

  const set = (value: T[]) => {
    if (!Array.isArray(value)) {
      throw new Error(
        `Cannot set a form with fields to a primitive value (${value})`,
      );
    }

    const newFields = fields();
    newFields.length = value.length;

    for (let i = 0; i < value.length; i++) {
      if (!newFields[i]) {
        newFields[i] = form(value[i]);
      } else {
        newFields[i].set(value[i]);
      }
    }

    fields.set([...newFields]);
  };

  return {
    value,
    set,
    fields,
  };
}

function formRecord<
  T extends {
    [K: string | number]: FormValue;
  },
>(initialValue: T) {
  const initialFields = mapValues(initialValue, (value) => form(value)) as {
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

    for (const key in currentFields) {
      if (!(key in value)) {
        delete currentFields[key];
      }
    }

    if (Object.keys(missingFields).length === 0) {
      return;
    }

    fields.set({
      ...currentFields,
      ...missingFields,
    });
  };

  return {
    value,
    set,
    fields,
  };
}

export function form(initialValue: string): Form<string>;
export function form(initialValue: number): Form<number>;
export function form(initialValue: boolean): Form<boolean>;
export function form<T extends FormValue>(initialValue: T): Form<T>;
export function form<T extends FormValue>(initialValue: T): Form<T> {
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
}
