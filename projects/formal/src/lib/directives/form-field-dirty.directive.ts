import { Directive, computed } from '@angular/core';
import { FormValue } from '../form';
import { isDirty } from '../form/state/dirty/dirty';
import { FormFieldDirective } from './form-field.directive';

@Directive({
    selector: '[formField]',
    host: {
        '[class.ng-dirty]': 'dirty()',
        '[class.ng-pristine]': '!dirty()',
    },
    standalone: false
})
export class FormFieldDirtyDirective<
  T extends FormValue,
> extends FormFieldDirective<T> {
  readonly dirty = computed(() => this.form && isDirty(this.form));

  constructor() {
    super();
  }
}
