import { form, isPristine } from 'formal';
import { signalSpy } from '../../../utility/signal-spy.spec';
import { isDirty, setIsDirty } from './dirty';

describe('dirty', () => {
  it('should work', () => {
    const myForm = form('');
    expect(isDirty(myForm)).toBe(false);
    expect(isPristine(myForm)).toBe(true);

    setIsDirty(myForm, true);

    expect(isDirty(myForm)).toBe(true);
    expect(isPristine(myForm)).toBe(false);

    setIsDirty(myForm, false);

    expect(isDirty(myForm)).toBe(false);
    expect(isPristine(myForm)).toBe(true);
  });

  it('should be reactive', () => {
    const myForm = form('');
    const isDirtySpy = signalSpy(() => isDirty(myForm), 'isDirty');
    const isPristineSpy = signalSpy(() => isPristine(myForm), 'isPristine');
    expect(isDirtySpy.lastValue()).toBe(false);
    expect(isPristineSpy.lastValue()).toBe(true);

    setIsDirty(myForm, true);

    expect(isDirtySpy.lastValue()).toBe(true);
    expect(isPristineSpy.lastValue()).toBe(false);

    setIsDirty(myForm, false);

    expect(isDirtySpy.lastValue()).toBe(false);
    expect(isPristineSpy.lastValue()).toBe(true);
  });

  it('should propagate to parent', () => {
    const myForm = form({
      child: 'Hello!',
    });

    const isDirtySpy = signalSpy(() => isDirty(myForm), 'isDirty');
    expect(isDirtySpy.lastValue()).toBe(false);

    setIsDirty(myForm.fields().child, true);

    expect(isDirtySpy.lastValue()).toBe(true);

    setIsDirty(myForm.fields().child, false);

    expect(isDirtySpy.lastValue()).toBe(false);

    setIsDirty(myForm.fields().child, true);

    expect(isDirtySpy.lastValue()).toBe(true);

    // should setting to false it should propagate to children
    setIsDirty(myForm, false);

    expect(isDirtySpy.lastValue()).toBe(false);
    expect(isDirty(myForm.fields().child)).toBe(false);

    // setting to true should not propagate to children
    setIsDirty(myForm, true);

    expect(isDirtySpy.lastValue()).toBe(true);
    expect(isDirty(myForm.fields().child)).toBe(false);
  });
});
