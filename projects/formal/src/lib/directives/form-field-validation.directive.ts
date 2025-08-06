import { Directive, computed } from '@angular/core';
import { FormValue, isInvalid, isValid } from '../form';
import { FormFieldDirective } from './form-field.directive';

@Directive({
    selector: '[formField]',
    host: {
        '[class.ng-invalid]': 'invalid()',
        '[class.ng-valid]': 'valid()',
    },
    standalone: false
})
export class FormFieldValidationDirective<
  T extends FormValue,
> extends FormFieldDirective<T> {
  readonly invalid = computed(() => this.form && isInvalid(this.form));
  readonly valid = computed(() => this.form && isValid(this.form));

  constructor() {
    super();
  }
}
