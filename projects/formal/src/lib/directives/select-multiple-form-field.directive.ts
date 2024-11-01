import { Directive, ElementRef, inject } from '@angular/core';
import { bindDisableAttributeDirective } from './bind-disable-attribute';
import { FormFieldDirective } from './form-field.directive';

@Directive({
  selector: 'select[multiple][formField]',
  standalone: true,
  host: {
    '(change)': 'handleChange($event.target)',
    '(blur)': 'onTouched()',
  },
})
export class SelectMultipleFormFieldDirective<
  T extends string,
> extends FormFieldDirective<T[]> {
  private _selectElement = inject(ElementRef)
    .nativeElement as HTMLSelectElement;

  handleChange(element: HTMLSelectElement) {
    this.viewValueChange(
      Array.from(element.selectedOptions, ({ value }) => value as T),
    );
  }

  constructor() {
    super();
    bindDisableAttributeDirective(() => this.form);
    this._onChange((value) => {
      for (const option of Array.from(this._selectElement.options)) {
        option.selected = value.includes(option.value as T);
      }
    });
  }
}
