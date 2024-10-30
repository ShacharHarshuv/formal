import { form, isDirty, reset, setIsDirty } from 'formal';

describe('reset', () => {
  it('should work', () => {
    const myForm = form('');
    setIsDirty(myForm, true);

    reset(myForm, 'new value');

    expect(isDirty(myForm)).toBe(false);
  });
});
