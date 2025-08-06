import { Directive } from '@angular/core';
import { bindDisableAttributeDirective } from './bind-disable-attribute';
import { FormFieldDirective } from './form-field.directive';
import { injectSetProperty } from './set-property';

@Directive({
    selector: 'input[type=range][formField]',
    host: {
        '(change)': 'onInput($event)',
        '(input)': 'onInput($event)',
        '(blur)': 'onTouched()',
    },
    standalone: false
})
export class RangeFormFieldDirective extends FormFieldDirective<number> {
  readonly setProperty = injectSetProperty();

  onInput($event: InputEvent): void {
    const { value } = $event.target as HTMLInputElement;

    this.viewValueChange(+value);
  }

  constructor() {
    super();
    bindDisableAttributeDirective(() => this.form);
    this._onChange((value) => {
      this.setProperty('value', value);
    });
  }
}
