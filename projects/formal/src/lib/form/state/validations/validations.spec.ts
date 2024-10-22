import { signalSpy } from '../../../utility/signal-spy.spec';
import { form, Form, ReadonlyForm } from '../../form';
import { errorMessages } from './error-messages';
import { firstErrorMessage } from './first-error-messages';
import { isInvalid } from './is-invalid';
import { isValid } from './is-valid';
import { ValidationFn } from './validator';
import {
  ownValidationErrors,
  validationErrors,
  withValidators,
} from './with-validators';

describe('validations', () => {
  it('type enforcement', () => {
    const numberValidator = (value: Form<number>) => null;
    // @ts-expect-error
    form('hello', [withValidators(numberValidator)]);
  });

  it('no validators', () => {
    const myForm = form('hello');
    expect(isValid(myForm)).toBe(true);
    expect(isInvalid(myForm)).toBe(false);
    expect(ownValidationErrors(myForm)).toEqual([]);
    expect(validationErrors(myForm)).toEqual([]);
    expect(errorMessages(myForm)).toEqual([]);
    expect(firstErrorMessage(myForm)).toBe(null);
  });

  it('one validator with no message', () => {
    const myForm = form('hello', [withValidators(() => ({ invalid: true }))]);
    expect(isValid(myForm)).toBe(false);
    expect(isInvalid(myForm)).toBe(true);
    expect(ownValidationErrors(myForm)).toEqual([{ invalid: true }]);
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
    expect(ownValidationErrors(myForm)).toEqual(['early morning madness']);
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
    expect(ownValidationErrors(myForm)).toEqual([error]);
    expect(validationErrors(myForm)).toEqual([error]);
    expect(errorMessages(myForm)).toEqual(['I am home at last']);
    expect(firstErrorMessage(myForm)).toBe('I am home at last');
  });

  it('one validation based on form value', () => {
    const myForm = form('', [
      withValidators((form) =>
        form() === 'hello' ? 'hello is not allowed' : null,
      ),
    ]);

    const isValidSpy = signalSpy(() => isValid(myForm), 'isValid');
    const isInvalidSpy = signalSpy(() => isInvalid(myForm), 'isInvalid');
    const validationErrorsSpy = signalSpy(
      () => validationErrors(myForm),
      'validationErrors',
    );
    const ownValidationErrorsSpy = signalSpy(
      () => ownValidationErrors(myForm),
      'ownValidationErrors',
    );
    const errorMessagesSpy = signalSpy(
      () => errorMessages(myForm),
      'errorMessages',
    );
    const firstErrorMessageSpy = signalSpy(
      () => firstErrorMessage(myForm),
      'firstErrorMessage',
    );

    expect(isValidSpy.lastValue()).toBe(true);
    expect(isInvalidSpy.lastValue()).toBe(false);
    expect(validationErrorsSpy.lastValue()).toEqual([]);
    expect(errorMessagesSpy.lastValue()).toEqual([]);
    expect(ownValidationErrorsSpy.lastValue()).toEqual([]);
    expect(firstErrorMessageSpy.lastValue()).toBe(null);

    myForm.set('hello');

    expect(isValidSpy.lastValue()).toBe(false);
    expect(isInvalidSpy.lastValue()).toBe(true);
    expect(ownValidationErrorsSpy.lastValue()).toEqual([
      'hello is not allowed',
    ]);
    expect(validationErrorsSpy.lastValue()).toEqual(['hello is not allowed']);
    expect(errorMessagesSpy.lastValue()).toEqual(['hello is not allowed']);
    expect(firstErrorMessageSpy.lastValue()).toBe('hello is not allowed');
  });

  it('two validators', () => {
    const myForm = form('hello', [
      withValidators(
        () => 'early morning madness',
        () => 'late night madness',
      ),
    ]);

    expect(isValid(myForm)).toBe(false);
    expect(isInvalid(myForm)).toBe(true);
    expect(validationErrors(myForm)).toEqual([
      'early morning madness',
      'late night madness',
    ]);
    expect(errorMessages(myForm)).toEqual([
      'early morning madness',
      'late night madness',
    ]);
    expect(firstErrorMessage(myForm)).toBe('early morning madness');
  });

  it('two validators reactive', () => {
    const divisibleBy =
      (n: number): ValidationFn<number> =>
      (form: ReadonlyForm<number>) => {
        return form() % n === 0 ? null : `${form()} is not divisible by ${n}`;
      };

    const myForm = form(0, [withValidators(divisibleBy(2), divisibleBy(3))]);
    const errorMessagesSpy = signalSpy(() => errorMessages(myForm), 'errors');
    expect(errorMessagesSpy.lastValue()).toEqual([]);
    myForm.set(2);
    expect(errorMessagesSpy.lastValue()).toEqual(['2 is not divisible by 3']);
    myForm.set(3);
    expect(errorMessagesSpy.lastValue()).toEqual(['3 is not divisible by 2']);
    myForm.set(6);
    expect(errorMessagesSpy.lastValue()).toEqual([]);
  });

  describe('nested forms', () => {
    describe('invalid child', () => {
      it('record', () => {
        const myForm = form({
          child: form('hello', [withValidators(() => 'no')]),
        });
        expect(isValid(myForm)).toBe(false);
        expect(isInvalid(myForm)).toBe(true);
        expect(ownValidationErrors(myForm)).toEqual([]);
        expect(validationErrors(myForm)).toEqual(['no']);
        expect(errorMessages(myForm)).toEqual(['no']);
        expect(firstErrorMessage(myForm)).toBe('no');
      });

      it('array', () => {
        const myForm = form({
          children: form([form('hello', [withValidators(() => 'no')])]),
        });
        expect(isValid(myForm)).toBe(false);
        expect(isInvalid(myForm)).toBe(true);
        expect(ownValidationErrors(myForm)).toEqual([]);
        expect(validationErrors(myForm)).toEqual(['no']);
        expect(errorMessages(myForm)).toEqual(['no']);
        expect(firstErrorMessage(myForm)).toBe('no');
      });
    });

    describe('invalid grandchild', () => {
      it('record', () => {
        const myForm = form({
          child: form({
            grandchild: form('hello', [withValidators(() => 'no')]),
          }),
        });
        expect(isValid(myForm)).toBe(false);
        expect(isInvalid(myForm)).toBe(true);
        expect(ownValidationErrors(myForm)).toEqual([]);
        expect(validationErrors(myForm)).toEqual(['no']);
        expect(errorMessages(myForm)).toEqual(['no']);
        expect(firstErrorMessage(myForm)).toBe('no');
      });
    });
    it('array', () => {
      const myForm = form([
        form([form('hello', [withValidators(() => 'no')])]),
      ]);
      expect(isValid(myForm)).toBe(false);
      expect(isInvalid(myForm)).toBe(true);
      expect(ownValidationErrors(myForm)).toEqual([]);
      expect(validationErrors(myForm)).toEqual(['no']);
      expect(errorMessages(myForm)).toEqual(['no']);
      expect(firstErrorMessage(myForm)).toBe('no');
    });

    describe('both parent and child invalid', () => {
      it('record', () => {
        const myForm = form(
          {
            child: form('hello', [withValidators(() => 'child')]),
          },
          [withValidators(() => 'parent')],
        );
        expect(isValid(myForm)).toBe(false);
        expect(isInvalid(myForm)).toBe(true);
        expect(ownValidationErrors(myForm)).toEqual(['parent']);
        expect(validationErrors(myForm)).toEqual(['parent', 'child']);
        expect(errorMessages(myForm)).toEqual(['parent', 'child']);
        expect(firstErrorMessage(myForm)).toBe('parent');
      });

      it('array', () => {
        const myForm = form(
          [form([form('hello', [withValidators(() => 'child')])])],
          [withValidators(() => 'parent')],
        );
        expect(isValid(myForm)).toBe(false);
        expect(isInvalid(myForm)).toBe(true);
        expect(ownValidationErrors(myForm)).toEqual(['parent']);
        expect(validationErrors(myForm)).toEqual(['parent', 'child']);
        expect(errorMessages(myForm)).toEqual(['parent', 'child']);
        expect(firstErrorMessage(myForm)).toBe('parent');
      });
    });
  });
});
