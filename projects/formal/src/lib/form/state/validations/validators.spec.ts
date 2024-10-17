import { form, validators, withValidators } from 'formal';

describe('validators', () => {
  it('no validations', () => {
    expect(validators(form('hello'))).toEqual([]);
  });

  it('custom validation', () => {
    const validation = () => 'no';
    expect(validators(form('hello', [withValidators(validation)]))).toEqual([
      validation,
    ]);
  });
});
