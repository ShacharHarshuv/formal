import { computed } from '@angular/core';
import { StaticOrGetter, toGetter } from '../../../utility/static-or-getter';
import { ReadonlyForm } from '../../form';
import { PARENT } from '../../parent';
import { defineFormState } from '../form-state';

type DisabledState = boolean | string | null | undefined;

const [readState, stateFactory] = defineFormState('disabled', {
  default: false,
  createState: (
    form,
    isDisabled: StaticOrGetter<DisabledState, [ReadonlyForm]>,
  ) => {
    const getIsDisabled = toGetter(isDisabled);
    return computed(() => {
      return getIsDisabled(form);
    });
  },
});

export const disabledIf = stateFactory;

function readStateRecursively(form: ReadonlyForm): DisabledState {
  const currentState = readState(form);
  if (typeof currentState === 'string' || currentState === true) {
    return currentState;
  }

  return form[PARENT] ? readStateRecursively(form[PARENT]) : currentState;
}

export function isDisabled(form: ReadonlyForm): boolean {
  return !!readStateRecursively(form);
}

export function disabledHint(form: ReadonlyForm): string {
  const state = readStateRecursively(form);
  return typeof state === 'string' ? state : '';
}
