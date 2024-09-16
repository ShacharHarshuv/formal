import { Component } from '@angular/core';
import { FormFieldDirective } from '../../../formal/src/lib/directives/form-field.directive';

@Component({
  selector: 'app-custom-form-field-number',
  standalone: true,
  imports: [],
  templateUrl: './custom-form-field-number.component.html',
})
export class CustomFormFieldNumberComponent extends FormFieldDirective<number> {
  add(diff: number) {
    this.form?.update((value) => value + diff);
  }

  constructor() {
    super();
  }
}
