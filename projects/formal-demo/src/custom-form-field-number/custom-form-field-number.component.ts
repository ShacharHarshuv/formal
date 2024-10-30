import { Component } from '@angular/core';
import { FormFieldDirective } from '../../../formal/src/lib/directives/form-field.directive';

@Component({
  selector: 'app-custom-form-field-number',
  standalone: true,
  imports: [],
  templateUrl: './custom-form-field-number.component.html',
})
export class CustomFormFieldNumberComponent extends FormFieldDirective<
  number | null
> {
  add(diff: number) {
    this.updateViewValue((value) => (value ?? 0) + diff);
  }

  constructor() {
    super();
  }
}
