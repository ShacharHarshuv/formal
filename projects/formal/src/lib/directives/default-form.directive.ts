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

@Directive({
  selector: 'input:not([type=checkbox])[formField],textarea[formField]',
  standalone: true,
})
export class DefaultFormDirective {
  private readonly _elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly _renderer = inject(Renderer2);
  private readonly _form = signal<Form<string> | null>(null)

  @Input({
    alias: 'formField',
    required: true,
  })
  set formInput(value: Form<string>) {
    this._form.set(value);
  }

  @HostListener('input', ['$event'])
  onInput($event: InputEvent): void {
    this._form()?.set(($event.target as HTMLInputElement).value);
  }

  constructor() {
    effect(() => {
      const form = this._form();
      if (!form) {
        return;
      }
      this._renderer.setProperty(this._elementRef.nativeElement, 'value', form());
    })
  }
}
