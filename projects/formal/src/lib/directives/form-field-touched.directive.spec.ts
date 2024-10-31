import { form } from 'formal';
import { createComponentFixtureWithForm } from './create-component-fixture-with-form';

describe('FormFieldTouchedDirective', () => {
  it('should work', () => {
    const [fixture, inputElm] = createComponentFixtureWithForm(
      form('Hello, World!'),
    );
    expect(inputElm.classList).toContain('ng-untouched');
    expect(inputElm.classList).not.toContain('ng-touched');

    fixture.touch();

    expect(inputElm.classList).not.toContain('ng-untouched');
    expect(inputElm.classList).toContain('ng-touched');
  });
});
