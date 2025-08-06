import { Directive } from '@angular/core';
import { bindDisableAttributeDirective } from './bind-disable-attribute';
import { FormFieldDirective } from './form-field.directive';
import { injectSetProperty } from './set-property';

@Directive({
    selector: 'select:not([multiple])[formField]',
    host: {
        '(change)': 'viewValueChange($event.target.value)',
        '(blur)': 'onTouched()',
    },
    standalone: false
})
export class SelectFormFieldDirective<
  T extends string,
> extends FormFieldDirective<T> {
  readonly setProperty = injectSetProperty();

  constructor() {
    super();
    bindDisableAttributeDirective(() => this.form);
    this._onChange((value) => {
      this.setProperty('value', value);
    });
  }
}
