import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
} from '@angular/core';
import { FormFieldDirective } from './form-field.directive';

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
      this._renderer.setProperty(
        this._elementRef.nativeElement,
        'value',
        value,
      );
    });
  }
}
