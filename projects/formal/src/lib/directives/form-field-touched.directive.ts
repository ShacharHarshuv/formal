import { Directive, computed } from '@angular/core';
import { FormValue } from '../form';
import { isTouched } from '../form/state/touched/touched';
import { FormFieldDirective } from './form-field.directive';

@Directive({
    selector: '[formField]',
    host: {
        '[class.ng-touched]': 'touched()',
        '[class.ng-untouched]': '!touched()',
    },
    standalone: false
})
export class FormFieldTouchedDirective<
  T extends FormValue,
> extends FormFieldDirective<T> {
  readonly touched = computed(() => this.form && isTouched(this.form));

  constructor() {
    super();
  }
}
