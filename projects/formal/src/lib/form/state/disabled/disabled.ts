import { Form } from 'formal';
import { StaticOrGetter, toGetter } from '../../../utility/static-or-getter';
import { StaticOrSignal, toSignal } from '../../../utility/static-or-signal';
import { PARENT } from '../../parent';
import { defineFormState } from '../form-state';

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

function readStateRecursively(form: Form): DisabledState {
  const currentState = readState(form);
  if (typeof currentState === 'string' || currentState === true) {
    return currentState;
  }

  return form[PARENT] ? readStateRecursively(form[PARENT]) : currentState;
}

export function isDisabled(form: Form): boolean {
  return !!readStateRecursively(form);
}

export function disabledHint(form: Form): string {
  const state = readStateRecursively(form);
  return typeof state === 'string' ? state : '';
}
