import { form, isDirty, reset, setIsDirty } from 'formal';
import { isTouched, setIsTouched } from './touched/touched';

describe('reset', () => {
  it('should work', () => {
    const myForm = form('');
    setIsDirty(myForm, true);
    setIsTouched(myForm, true);

    reset(myForm, 'new value');

    expect(isDirty(myForm)).toBe(false);
    expect(isTouched(myForm)).toBe(false);
  });
});
