import { Directive, HostListener } from '@angular/core';
import { bindDisableAttributeDirective } from './bind-disable-attribute';
import { FormFieldDirective } from './form-field.directive';
import { injectSetProperty } from './set-property';

@Directive({
  selector: 'input[formField][type="number"]',
  standalone: true,
})
export class NumberInputFormFieldDirective extends FormFieldDirective<
  number | null
> {
  readonly setProperty = injectSetProperty();

  @HostListener('input', ['$event'])
  onInput($event: InputEvent): void {
    const { value } = $event.target as HTMLInputElement;

    if (value === '') {
      this.form?.set(null);
      return;
    }

    this.form?.set(+value);
  }

  constructor() {
    super();
    bindDisableAttributeDirective(() => this.form);
    this._onChange((value) => {
      this.setProperty('value', value);
    });
  }
}