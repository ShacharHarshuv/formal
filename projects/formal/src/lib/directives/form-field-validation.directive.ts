import { Directive, computed } from '@angular/core';
import { FormValue, isInvalid, isValid } from 'formal';
import { FormFieldDirective } from './form-field.directive';

@Directive({
  selector: '[formField]',
  standalone: true,
  host: {
    '[class.ng-invalid]': 'invalid()',
    '[class.ng-valid]': 'valid()',
  },
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
