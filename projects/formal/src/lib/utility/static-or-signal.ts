import { Signal, computed, isSignal } from '@angular/core';

export type StaticOrSignal<T> = T | Signal<T>;

export function toSignal<T>(staticOrGetter: StaticOrSignal<T>): Signal<T> {
  if (isSignal(staticOrGetter)) {
    return staticOrGetter as Signal<T>;
  } else {
    return computed(() => staticOrGetter as T);
  }
}
