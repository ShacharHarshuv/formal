import { Directive } from '@angular/core';
import { bindDisableAttributeDirective } from './bind-disable-attribute';
import { FormFieldDirective } from './form-field.directive';
import { injectSetProperty } from './set-property';

@Directive({
  selector: 'input[type=checkbox][formField]',
  standalone: true,
  host: {
    '(change)': 'viewValueChange($event.target.checked)',
    '(blur)': 'onTouched()',
  },
})
export class CheckboxFormFieldDirective extends FormFieldDirective<boolean> {
  constructor() {
    super();
    const setProperty = injectSetProperty();
    bindDisableAttributeDirective(() => this.form);
    this._onChange((value) => {
      setProperty('checked', value);
    });
  }
}
