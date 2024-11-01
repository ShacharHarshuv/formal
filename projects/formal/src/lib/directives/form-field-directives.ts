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

export const formalDirectives = [
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
];
