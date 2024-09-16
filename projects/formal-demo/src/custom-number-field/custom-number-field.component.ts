import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-number-field',
  standalone: true,
  imports: [],
  templateUrl: './custom-number-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomNumberFieldComponent),
      multi: true,
    },
  ],
})
export class CustomNumberFieldComponent implements ControlValueAccessor {
  value: number = 0;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  // Add methods to handle changes and touch events
  handleInputChange(value: number): void {
    this.value = value;
    this.onChange(value);
  }

  handleBlur(): void {
    this.onTouched();
  }
}