import { computed, signal, WritableSignal } from '@angular/core';
import { Form } from '../form';
import { fieldsDescriptors } from '../public-utility';
import { defineFormState } from './form-state';

export function dirtyOrTouchedFormState(name: string) {
  const [readState, stateFactory] = defineFormState('dirty', {
    default: null,
    createState: () =>
      computed((): WritableSignal<boolean> | null => signal(false)),
  });

  function get(form: Form): boolean {
    let state = readState(form);

    if (!state) {
      stateFactory()(form);
      state = readState(form);
    }

    return (
      state!() || fieldsDescriptors(form).some(({ form: child }) => get(child))
    );
  }

  function set(form: Form, value: boolean) {
    let state = readState(form);

    if (!state) {
      stateFactory()(form);
      state = readState(form);
    }

    state!.set(value);

    if (!value) {
      fieldsDescriptors(form).forEach(({ form: child }) => set(child, false));
    }
  }

  return [get, set] as const;
}
