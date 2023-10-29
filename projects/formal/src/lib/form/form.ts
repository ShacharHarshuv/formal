import {
  WritableSignal,
  signal,
} from '@angular/core';

export type Form<T> = (() => T) & Pick<WritableSignal<T>, 'set' | 'mutate' | 'update'>;

export function form<T>(initialValue: T): Form<T> {
  return signal(initialValue);
}
