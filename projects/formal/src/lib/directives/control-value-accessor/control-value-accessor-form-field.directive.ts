import {
  Directive,
  inject,
  Optional,
  Self,
  Inject,
  forwardRef,
} from '@angular/core';
import { FormFieldDirective } from '../form-field.directive';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NgControl,
} from '@angular/forms';
import { selectValueAccessor } from './select-value-accessor';
import { FormValue } from '../../form/form';

@Directive({
  selector: '[formField]',
  standalone: true,
  providers: [
    {
      provide: NgControl,
      useExisting: forwardRef(() => ControlValueAccessorFormFieldDirective),
    }
  ]
})
export class ControlValueAccessorFormFieldDirective<
  T extends FormValue,
> extends FormFieldDirective<T> {
  valueAccessor: ControlValueAccessor | null = null;

  constructor(
    @Optional() @Self() @Inject(NG_VALUE_ACCESSOR) valueAccessors: ControlValueAccessor[],
  ) {
    super();

    this.valueAccessor = selectValueAccessor(
      inject(NG_VALUE_ACCESSOR, { optional: true, self: true }),
    );

    // form -> vca
    this._onChange((value: T) => {
      this.valueAccessor?.writeValue(value);
    });

    // vca -> form
    this.valueAccessor?.registerOnChange((value: T) => {
      this._form()?.set(value);
    });
  }
}
