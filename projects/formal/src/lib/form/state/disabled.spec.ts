import {
  form,
  FormValue,
} from 'formal';
import {
  disabledIf,
  isDisabled,
  disabledHint,
} from './disabled';
import { isEqual } from 'lodash';
import {
  signal,
  computed,
} from '@angular/core';
import { signalSpy } from '../../utility/signal-spy.spec';

describe('Disabled', () => {
  test('primitive', 'Sweeney', 'Todd');
  test('object', {name: 'Sweeney'}, {name: 'Todd'});
  test('array', ['Sweeney'], ['Todd']);

  function test<T extends FormValue>(name: string, initValue: T, otherValue: T) {
    describe(name, () => {
      it('should be false by default', () => {
        const myForm = form(initValue);
        expect(isDisabled(myForm)).toBe(false);
        expect(disabledHint(myForm)).toBe('');
      });

      it('should work with static values', () => {
        const myForm = form(initValue, [disabledIf(true)]);
        expect(isDisabled(myForm)).toBe(true);
        expect(disabledHint(myForm)).toBe('');
      });

      it('should work with getter values', () => {
        const myForm = form(initValue, [
          disabledIf((form) => isEqual(form(), initValue)),
        ]);
        expect(isDisabled(myForm)).toBe(true);
        expect(disabledHint(myForm)).toBe('');

        myForm.set(otherValue);

        expect(isDisabled(myForm)).toBe(false);
        expect(disabledHint(myForm)).toBe('');
      });

      it('should be reactive when changes', () => {
        const shouldDisable = signal<boolean>(false);
        const myForm = form(initValue, [disabledIf(shouldDisable)]);
        const isDisabledSignalSpy = signalSpy(computed(() => isDisabled(myForm)), 'isDisabled');
        expect(isDisabledSignalSpy.lastValue()).toBe(false);
        shouldDisable.set(true);
        expect(isDisabledSignalSpy.lastValue()).toBe(true);
      });

      it('should work with strings & nil values', () => {
        const myDisabledHint = signal<string | null | undefined>(undefined);
        const myForm = form(initValue, [disabledIf(myDisabledHint)]);

        const isDisabledSignalSpy = signalSpy(computed(() => isDisabled(myForm)), 'isDisabled');
        const disabledHintSignalSpy = signalSpy(computed(() => disabledHint(myForm)), 'disabledHint');

        expect(isDisabledSignalSpy.lastValue()).toBe(false);
        expect(disabledHintSignalSpy.lastValue()).toBe('');

        myDisabledHint.set(null);
        isDisabledSignalSpy.expectValueToNotChange();
        disabledHintSignalSpy.expectValueToNotChange()

        myDisabledHint.set('This is not available now');
        expect(isDisabledSignalSpy.lastValue()).toBe(true);
        expect(disabledHintSignalSpy.lastValue()).toBe('This is not available now');
      })
    });
  }
});
