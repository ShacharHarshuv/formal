import { form } from 'formal';
import { createComponentFixtureWithForm } from './create-component-fixture-with-form';

describe('FormFieldDirtyDirective', () => {
  it('should work', () => {
    const [fixture, inputElm] = createComponentFixtureWithForm(
      form('Hello, World!'),
    );
    expect(inputElm.classList).toContain('ng-pristine');
    expect(inputElm.classList).not.toContain('ng-dirty');

    fixture.changeViewValue('Hello, World!');

    expect(inputElm.classList).not.toContain('ng-pristine');
    expect(inputElm.classList).toContain('ng-dirty');
  });
});
