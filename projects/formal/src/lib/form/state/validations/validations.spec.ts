import { form } from '../../form';
import { errorMessages } from './error-messages';
import { firstErrorMessage } from './first-error-messages';
import { isInvalid } from './is-invalid';
import { isValid } from './is-valid';
import { validationErrors, withValidators } from './with-validators';

describe('validations', () => {
  it('no validators', () => {
    const myForm = form('hello');
    expect(isValid(myForm)).toBe(true);
    expect(isInvalid(myForm)).toBe(false);
    expect(validationErrors(myForm)).toEqual([]);
    expect(errorMessages(myForm)).toEqual([]);
    expect(firstErrorMessage(myForm)).toBe(null);
  });

  it('one validator with no message', () => {
    const myForm = form('hello', [withValidators(() => ({ invalid: true }))]);
    expect(isValid(myForm)).toBe(false);
    expect(isInvalid(myForm)).toBe(true);
    expect(validationErrors(myForm)).toEqual([{ invalid: true }]);
    expect(errorMessages(myForm)).toEqual([]);
    expect(firstErrorMessage(myForm)).toBe(null);
  });

  it('one validator with string error', () => {
    const myForm = form('hello', [
      withValidators(() => 'early morning madness'),
    ]);

    expect(isValid(myForm)).toBe(false);
    expect(isInvalid(myForm)).toBe(true);
    expect(validationErrors(myForm)).toEqual(['early morning madness']);
    expect(errorMessages(myForm)).toEqual(['early morning madness']);
    expect(firstErrorMessage(myForm)).toBe('early morning madness');
  });

  it('one validation with toString', () => {
    const error = {
      toString: () => 'I am home at last',
    };
    const myForm = form('hello', [withValidators(() => error)]);

    expect(isValid(myForm)).toBe(false);
    expect(isInvalid(myForm)).toBe(true);
    console.log(validationErrors(myForm));
    expect(validationErrors(myForm)).toEqual([error]);
    expect(errorMessages(myForm)).toEqual(['I am home at last']);
    expect(firstErrorMessage(myForm)).toBe('I am home at last');
  });
});
