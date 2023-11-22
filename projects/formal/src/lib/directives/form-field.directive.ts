import { signal, Input, Directive, effect } from '@angular/core';
import { Form, FormValue } from 'formal';

/**
 * Generic class for any directive that plugs into the formField input
 * */
@Directive()
export abstract class FormFieldDirective<T extends FormValue> {
  protected readonly _form = signal<Form<T> | null>(null);
  private _subscribers: ((value: T) => void)[] = [];
  private _lastValue: T | null = null;

  @Input({
    alias: 'formField',
    required: true,
  })
  set formInput(form: Form<T>) {
    this._form.set(form);
    // Initial value change necessary to avoid ExpressionChangedAfterItHasBeenCheckedError
    this._handleChange(form());
  }

  protected constructor() {
    effect(() => {
      const form = this._form();
      if (!form) {
        return;
      }

      this._handleChange(form());
    });
  }

  private _handleChange(value: T): void {
    if (this._lastValue === value) {
      return;
    }
    this._lastValue = value;

    this._subscribers.forEach((subscriber) => {
      subscriber(value);
    });
  }

  protected _onChange(subscriber: (value: T) => void) {
    this._subscribers.push(subscriber);
  }
}
