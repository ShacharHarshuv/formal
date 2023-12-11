import { ControlValueAccessorFormFieldDirective } from './control-value-accessor/control-value-accessor-form-field.directive';
import { DefaultFormFieldDirective } from './default-form-field.directive';

// todo: consider making it a module instead
export const FORM_FIELD_DIRECTIVES = [
  ControlValueAccessorFormFieldDirective,
  DefaultFormFieldDirective,
];
