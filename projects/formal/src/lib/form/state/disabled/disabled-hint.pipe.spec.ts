import { signal } from '@angular/core';
import { disabledIf, form } from 'formal';
import { pipeSpy } from '../../../utility/pipe-spy.spec';
import { DisabledHintPipe } from './disabled-hint.pipe';

describe('DisabledHintPipe', () => {
  it('should work', () => {
    const disableHint = signal<string | false>(false);
    const spy = pipeSpy(
      DisabledHintPipe,
      'disabledHint',
      form('Sweeney', [disabledIf(disableHint)]),
    );
    expect(spy.currentValue()).toBe('');
    disableHint.set('Hint!');
    expect(spy.currentValue()).toBe('Hint!');
  });
});
