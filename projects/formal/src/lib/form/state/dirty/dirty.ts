import { computed, signal, WritableSignal } from '@angular/core';
import { fieldsDescriptors } from 'formal';
import { ReadonlyForm } from '../../form';
import { defineFormState } from '../form-state';

const [readState, stateFactory] = defineFormState('dirty', {
  default: null,
  createState: () =>
    computed((): WritableSignal<boolean> | null => signal(false)),
});

export function isDirty(form: ReadonlyForm): boolean {
  let state = readState(form);

  if (!state) {
    stateFactory()(form);
    state = readState(form);
  }

  return (
    state!() ||
    fieldsDescriptors(form).some(({ form: child }) => isDirty(child))
  );
}

export function setIsDirty(form: ReadonlyForm, value: boolean) {
  let state = readState(form);

  if (!state) {
    stateFactory()(form);
    state = readState(form);
  }

  state!.set(value);

  if (!value) {
    fieldsDescriptors(form).forEach(({ form: child }) =>
      setIsDirty(child, false),
    );
  }
}
