import {
  Directive,
  Input,
  HostListener,
  signal,
  effect,
  ElementRef,
  inject,
  Renderer2,
} from '@angular/core';
import { Form } from 'formal';
import { FormFieldDirective } from './form-field.directive';

@Directive({
  selector: 'input:not([type=checkbox])[formField],textarea[formField]',
  standalone: true,
})
export class DefaultFormFieldDirective extends FormFieldDirective<string> {
  private readonly _elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly _renderer = inject(Renderer2);

  @HostListener('input', ['$event'])
  onInput($event: InputEvent): void {
    this._form()?.set(($event.target as HTMLInputElement).value);
  }

  constructor() {
    super();
    effect(() => {
      const form = this._form();
      if (!form) {
        return;
      }
      this._renderer.setProperty(this._elementRef.nativeElement, 'value', form());
    })
  }
}
