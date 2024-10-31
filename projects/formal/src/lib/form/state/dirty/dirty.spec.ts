import { form } from 'formal';
import { signalSpy } from '../../../utility/signal-spy.spec';
import { isDirty, setIsDirty } from './dirty';

describe('dirty', () => {
  it('should work', () => {
    const myForm = form('');
    expect(isDirty(myForm)).toBe(false);

    setIsDirty(myForm, true);

    expect(isDirty(myForm)).toBe(true);

    setIsDirty(myForm, false);

    expect(isDirty(myForm)).toBe(false);
  });

  it('should be reactive', () => {
    const myForm = form('');
    const isDirtySpy = signalSpy(() => isDirty(myForm), 'isDirty');
    expect(isDirtySpy.lastValue()).toBe(false);

    setIsDirty(myForm, true);

    expect(isDirtySpy.lastValue()).toBe(true);

    setIsDirty(myForm, false);

    expect(isDirtySpy.lastValue()).toBe(false);
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