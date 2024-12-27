import { NgModule } from '@angular/core';
import { CheckboxFormFieldDirective } from './checkbox-form-field.directive';
import { ControlValueAccessorFormFieldDirective } from './control-value-accessor/control-value-accessor-form-field.directive';
import { FormFieldDirtyDirective } from './form-field-dirty.directive';
import { FormFieldTouchedDirective } from './form-field-touched.directive';
import { FormFieldValidationDirective } from './form-field-validation.directive';
import { NativeStringFormFieldDirective } from './native-string-form-field.directive';
import { NumberInputFormFieldDirective } from './number-input-form-field.directive';
import { RadioFormFieldDirective } from './radio-form-field.directive';
import { RangeFormFieldDirective } from './range-form-field.directive';
import { SelectFormFieldDirective } from './select-form-field.directive';
import { SelectMultipleFormFieldDirective } from './select-multiple-form-field.directive';

@NgModule({
  declarations: [
    ControlValueAccessorFormFieldDirective,
    NativeStringFormFieldDirective,
    NumberInputFormFieldDirective,
    FormFieldValidationDirective,
    FormFieldDirtyDirective,
    FormFieldTouchedDirective,
    SelectFormFieldDirective,
    RangeFormFieldDirective,
    CheckboxFormFieldDirective,
    RadioFormFieldDirective,
    SelectMultipleFormFieldDirective,
  ],
  exports: [
    ControlValueAccessorFormFieldDirective,
    NativeStringFormFieldDirective,
    NumberInputFormFieldDirective,
    FormFieldValidationDirective,
    FormFieldDirtyDirective,
    FormFieldTouchedDirective,
    SelectFormFieldDirective,
    RangeFormFieldDirective,
    CheckboxFormFieldDirective,
    RadioFormFieldDirective,
    SelectMultipleFormFieldDirective,
  ],
})
export class FormalDirectivesModule {}
