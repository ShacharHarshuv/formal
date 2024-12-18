import { form, isRequired, min } from 'formal';
import { firstErrorMessage } from '../first-error-message';
import { isInvalid } from '../is-invalid';
import { isValid } from '../is-valid';
import { withValidators } from '../with-validators';
import { required } from './required';

describe('validations > required', () => {
  it('no validation', () => {
    const myForm = form('');
    expect(isRequired(myForm)).toBe(false);
  });

  it('should work', () => {
    const myForm = form('', [withValidators(required())]);
    expect(isRequired(myForm)).toBe(true);
    expect(isValid(myForm)).toBe(false);
    expect(isInvalid(myForm)).toBe(true);
    expect(firstErrorMessage(myForm)).toBe(null);

    myForm.set('hello');

    expect(isValid(myForm)).toBe(true);
    expect(isInvalid(myForm)).toBe(false);
    expect(firstErrorMessage(myForm)).toBe(null);
  });

  it('with message', () => {
    const myForm = form('', [
      withValidators(required('This Field is Required')),
    ]);
    expect(isValid(myForm)).toBe(false);
    expect(isInvalid(myForm)).toBe(true);
    expect(firstErrorMessage(myForm)).toBe('This Field is Required');

    myForm.set('hello');

    expect(isValid(myForm)).toBe(true);
    expect(isInvalid(myForm)).toBe(false);
    expect(firstErrorMessage(myForm)).toBe(null);
  });

  it('should work with nullable fields', () => {
    const myForm = form<{ x: 1 } | null>(null, [withValidators(required())]);
    expect(isValid(myForm)).toBe(false);

    myForm.set({ x: 1 });
    expect(isValid(myForm)).toBe(true);
  });

  it("should not be allowed when it's not needed", () => {
    // @ts-expect-error
    form(1, [withValidators(required())]);

    // @ts-expect-error
    form({ x: 1 }, [withValidators(required())]);

    // @ts-expect-error
    form(1, [withValidators(required(), min(1))]);
  });
});
