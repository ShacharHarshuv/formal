import { computed, effect } from '@angular/core';
import { isDisabled } from '../form';
import { Form } from '../form/form';
import { injectSetProperty } from './set-property';

export function bindDisableAttributeDirective(getForm: () => Form | null) {
  const setProperty = injectSetProperty();
  const shouldDisable = computed(() => {
    const form = getForm();
    return form ? isDisabled(form) : false;
  });
  effect(() => {
    setProperty('disabled', shouldDisable());
  });
}
