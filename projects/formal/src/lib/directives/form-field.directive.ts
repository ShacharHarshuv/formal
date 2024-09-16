import { Directive, effect, input } from '@angular/core';
import { Form, FormValue } from 'formal';

/**
 * Generic class for any directive that plugs into the formField input
 * */
@Directive()
export abstract class FormFieldDirective<T extends FormValue> {
  private _subscribers: ((value: T) => void)[] = [];
  private _lastValue: T | null = null;

  readonly _formInput = input<Form<T> | null>(null, {
    alias: 'formField',
  });

  get form() {
    return this._formInput();
  }

  protected constructor() {
    effect(() => {
      if (!this.form) {
        return;
      }
      this._handleChange(this.form());
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
