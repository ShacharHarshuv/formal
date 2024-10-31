import { form } from 'formal';
import { signalSpy } from '../../../utility/signal-spy.spec';
import { isTouched, setIsTouched } from './touched';

describe('touched', () => {
  it('should work', () => {
    const myForm = form('');
    expect(isTouched(myForm)).toBe(false);

    setIsTouched(myForm, true);

    expect(isTouched(myForm)).toBe(true);

    setIsTouched(myForm, false);

    expect(isTouched(myForm)).toBe(false);
  });

  it('should be reactive', () => {
    const myForm = form('');
    const isTouchedSpy = signalSpy(() => isTouched(myForm), 'isTouched');
    expect(isTouchedSpy.lastValue()).toBe(false);

    setIsTouched(myForm, true);

    expect(isTouchedSpy.lastValue()).toBe(true);

    setIsTouched(myForm, false);

    expect(isTouchedSpy.lastValue()).toBe(false);
  });

  it('should propagate to parent', () => {
    const myForm = form({
      child: 'Hello!',
    });

    const isTouchedSpy = signalSpy(() => isTouched(myForm), 'isTouched');
    expect(isTouchedSpy.lastValue()).toBe(false);

    setIsTouched(myForm.fields().child, true);

    expect(isTouchedSpy.lastValue()).toBe(true);

    setIsTouched(myForm.fields().child, false);

    expect(isTouchedSpy.lastValue()).toBe(false);

    setIsTouched(myForm.fields().child, true);

    expect(isTouchedSpy.lastValue()).toBe(true);

    // should setting to false it should propagate to children
    setIsTouched(myForm, false);

    expect(isTouchedSpy.lastValue()).toBe(false);
    expect(isTouched(myForm.fields().child)).toBe(false);

    // setting to true should not propagate to children
    setIsTouched(myForm, true);

    expect(isTouchedSpy.lastValue()).toBe(true);
    expect(isTouched(myForm.fields().child)).toBe(false);
  });
});
