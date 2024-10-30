import { ControlValueAccessorFormFieldDirective } from './control-value-accessor/control-value-accessor-form-field.directive';
import { FormFieldDirtyDirective } from './form-field-dirty.directive';
import { FormFieldValidationDirective } from './form-field-validation.directive';
import { NativeStringFormFieldDirective } from './native-string-form-field.directive';
import { NumberInputFormFieldDirective } from './number-input-form-field.directive';

export const formalDirectives = [
  ControlValueAccessorFormFieldDirective,
  NativeStringFormFieldDirective,
  NumberInputFormFieldDirective,
  FormFieldValidationDirective,
  FormFieldDirtyDirective,
];
