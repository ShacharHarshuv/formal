import { Form } from 'formal';
import { StaticOrGetter, toGetter } from '../../utility/static-or-getter';
import { StaticOrSignal, toSignal } from '../../utility/static-or-signal';
import { defineFormState } from './form-state';

type DisabledState = boolean | string | null | undefined;

const [readState, stateFactory] = defineFormState('disabled', {
  default: false,
  createState: (
    form,
    isDisabled: StaticOrGetter<StaticOrSignal<DisabledState>, [Form]>,
  ) => {
    return toSignal(toGetter(isDisabled)(form));
  },
});

export const disabledIf = stateFactory;

export function isDisabled(form: Form): boolean {
  return !!readState(form);
}

export function disabledHint(form: Form): string {
  const state = readState(form);
  return typeof state === 'string' ? state : '';
}
