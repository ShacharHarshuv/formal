import {
  computed,
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
} from '@angular/core';
import { isDisabled } from '../form/state/disabled';
import { FormFieldDirective } from './form-field.directive';

// TODO: Angular's DefaultValueAccessor handles "composition" which appears to be necessary for IME input, we should probably handle that too
// note we might need to create a separate one for a numeric value (like Angular does)
// also there is a mechanism to distinguish between "built in" CVAs, "default CVA" (last choice) and "custom CVA" (first choice). I'm not sure if we need to make this distinction. It's possible that we need to prevent multiple such directives from applying somehow

@Directive({
  selector: 'input:not([type=checkbox])[formField],textarea[formField]',
  standalone: true,
})
export class DefaultFormFieldDirective extends FormFieldDirective<
  string | number
> {
  private readonly _elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly _renderer = inject(Renderer2);

  @HostListener('input', ['$event'])
  onInput($event: InputEvent): void {
    this.form?.set(($event.target as HTMLInputElement).value);
  }

  constructor() {
    super();
    this._onChange((value: string | number) => {
      this.setProperty('value', value);
    });

    const shouldDisable = computed(() =>
      this.form ? isDisabled(this.form) : false,
    );
    effect(() => {
      this.setProperty('disabled', shouldDisable());
    });
  }

  protected setProperty(key: string, value: any): void {
    this._renderer.setProperty(this._elementRef.nativeElement, key, value);
  }
}
