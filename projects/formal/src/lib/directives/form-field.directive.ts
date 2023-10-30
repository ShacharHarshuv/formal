import {
  signal,
  Input,
  Directive,
} from '@angular/core';
import { Form } from 'formal';

@Directive()
export abstract class FormFieldDirective<T> {
  protected readonly _form = signal<Form<T> | null>(null)

  @Input({
    alias: 'formField',
    required: true,
  })
  set formInput(value: Form<T>) {
    this._form.set(value);
  }
}
