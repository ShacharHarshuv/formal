import { Directive, effect, forwardRef, inject, signal } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { FormValue } from '../../form/form';
import { FormFieldDirective } from '../form-field.directive';
import { selectValueAccessor } from './select-value-accessor';

@Directive({
  selector: '[formField]',
  standalone: true,
  providers: [
    {
      provide: NgControl,
      useExisting: forwardRef(() => ControlValueAccessorFormFieldDirective),
    },
  ],
})
export class ControlValueAccessorFormFieldDirective<
  T extends FormValue,
> extends FormFieldDirective<T> {
  private _valueAccessor = signal<ControlValueAccessor | null>(null);

  set valueAccessor(value: ControlValueAccessor | null) {
    this._valueAccessor.set(value);
  }

  constructor() {
    super();
    this.valueAccessor = selectValueAccessor(
      inject(NG_VALUE_ACCESSOR, {
        optional: true,
        self: true,
      }),
    );

    effect(() => {
      const currentValue = this._form()?.();
      currentValue && this._valueAccessor()?.writeValue(currentValue);

      // form -> vca
      this._onChange((value: T) => {
        this._valueAccessor()?.writeValue(value);
      });

      // vca -> form
      this._valueAccessor()?.registerOnChange((value: T) => {
        this._form()?.set(value);
      });
    });
  }
}
