import { Directive, HostListener } from '@angular/core';
import { bindDisableAttributeDirective } from './bind-disable-attribute';
import { FormFieldDirective } from './form-field.directive';
import { injectSetProperty } from './set-property';

// TODO(#4): Angular's DefaultValueAccessor handles "composition" which appears to be necessary for IME input, we should probably handle that too
// also there is a mechanism to distinguish between "built in" CVAs, "default CVA" (last choice) and "custom CVA" (first choice). I'm not sure if we need to make this distinction. It's possible that we need to prevent multiple such directives from applying somehow

@Directive({
  selector:
    'input:not([type="checkbox"]):not([type="number"])[formField],textarea[formField]',
  standalone: true,
})
export class NativeStringFormFieldDirective extends FormFieldDirective<string> {
  readonly setProperty = injectSetProperty();

  @HostListener('input', ['$event'])
  onInput($event: InputEvent): void {
    this.viewValueChange(($event.target as HTMLInputElement).value);
  }

  constructor() {
    super();
    bindDisableAttributeDirective(() => this.form);
    this._onChange((value) => {
      this.setProperty('value', value);
    });
  }
}
