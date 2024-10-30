import { form, withValidators } from 'formal';
import { createComponentFixtureWithForm } from './create-component-fixture-with-form';

describe('FormFieldValidationDirective', () => {
  it('valid', () => {
    const [fixture, inputElm] = createComponentFixtureWithForm(
      form('Hello, World!'),
    );
    expect(inputElm.classList).toContain('ng-valid');
    expect(inputElm.classList).not.toContain('ng-invalid');
    expect(inputElm.classList).not.toContain('ng-pending');
  });

  it('invalid', () => {
    const [fixture, inputElm] = createComponentFixtureWithForm(
      form('', [withValidators(() => 'error!')]),
    );
    expect(inputElm.classList).toContain('ng-invalid');
    expect(inputElm.classList).not.toContain('ng-valid');
    expect(inputElm.classList).not.toContain('ng-pending');
  });
});
