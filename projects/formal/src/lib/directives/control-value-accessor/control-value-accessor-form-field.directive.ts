import {
  Directive,
  inject,
  effect,
} from '@angular/core';
import { FormFieldDirective } from '../form-field.directive';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { selectValueAccessor } from './select-value-accessor';

@Directive({
  selector: '[formField]',
  standalone: true,
})
export class ControlValueAccessorFormFieldDirective<T> extends FormFieldDirective<T> {
  constructor() {
    super();

    const valueAccessor = selectValueAccessor(inject(NG_VALUE_ACCESSOR, {optional: true}));

    if (!valueAccessor) {
      return;
    }

    // form -> vca
    effect(() => {
      const form = this._form();
      if (!form) {
        return;
      }
      valueAccessor.writeValue(form());
    });

    // vca -> form
    valueAccessor.registerOnChange((value: T) => {
      this._form()?.set(value);
    });
  }

}
