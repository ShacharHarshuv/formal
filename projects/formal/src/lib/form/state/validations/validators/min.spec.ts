import {
  firstErrorMessage,
  form,
  isInvalid,
  isValid,
  min,
  required,
  withValidators,
} from 'formal';

describe('validations > min', () => {
  it('no validation', () => {
    const myForm = form(1);
    expect(isValid(myForm)).toBe(true);
  });

  it('should work', () => {
    const myForm = form(1, [withValidators(min(2))]);
    expect(isValid(myForm)).toBe(false);
    expect(isInvalid(myForm)).toBe(true);
    expect(firstErrorMessage(myForm)).toBe(null);

    myForm.set(3);

    expect(isValid(myForm)).toBe(true);
    expect(isInvalid(myForm)).toBe(false);
    expect(firstErrorMessage(myForm)).toBe(null);
  });

  it('with message', () => {
    const myForm = form(1, [withValidators(min(2, 'Must be at least 2'))]);
    expect(isValid(myForm)).toBe(false);
    expect(isInvalid(myForm)).toBe(true);
    expect(firstErrorMessage(myForm)).toBe('Must be at least 2');

    myForm.set(3);

    expect(isValid(myForm)).toBe(true);
    expect(isInvalid(myForm)).toBe(false);
    expect(firstErrorMessage(myForm)).toBe(null);
  });

  it('should work with nullable fields', () => {
    const myForm = form<number | null>(null, [withValidators(min(2))]);
    expect(isValid(myForm)).toBe(true);

    myForm.set(3);
    expect(isValid(myForm)).toBe(true);
  });

  it('should not be allowed on a non-number field', () => {
    // @ts-expect-error
    form('hello', [withValidators(min(2))]);

    // @ts-expect-error
    form('hello', [withValidators(required(), min(2))]);
  });

  it('should work with other validators', () => {
    form<number | null>(1, [withValidators(required(), min(2))]);
  });
});
