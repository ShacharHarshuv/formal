import { Component, forwardRef, inject, signal, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { form, FormalDirectivesModule } from 'formal';
import { testFormFieldDirectiveViewBinding } from '../test-form-field-directive-view-binding.spec';

abstract class AbstractCustomInputComponent implements ControlValueAccessor {
  disabled = signal(false);
  value: string = '';
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled.set(isDisabled);
  }

  onInput($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }
}

@Component({
  selector: 'app-custom-input',
  template: `<input
    [value]="value"
    [disabled]="disabled()"
    (input)="onInput($event)"
    (blur)="onTouched()"
  />`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputAccessorProvidedComponent),
      multi: true,
    },
  ],
  standalone: true,
  host: {
    // to test for potential ExpressionChangedAfterItHasBeenCheckedError
    '[class.custom-input]': 'value',
  },
})
export class CustomInputAccessorProvidedComponent extends AbstractCustomInputComponent {}

@Component({
  selector: 'app-custom-input',
  template: `<input
      [value]="value"
      [disabled]="disabled()"
      (input)="onInput($event)"
      (blur)="onTouched()"
    />
    Disabled: {{ disabled() }}`,
  standalone: true,
  host: {
    // to test for potential ExpressionChangedAfterItHasBeenCheckedError
    '[class.custom-input]': 'value',
  },
})
export class CustomInputAccessorSelfInsertedComponent extends AbstractCustomInputComponent {
  constructor() {
    super();

    const ngControl = inject(NgControl, {
      optional: true,
      self: true,
    });

    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }
}

describe('ControlValueAccessorFormFieldDirective', () => {
  test('accessor provided', CustomInputAccessorProvidedComponent);
  test('accessor self inserted', CustomInputAccessorSelfInsertedComponent);
});

function test(name: string, customControlComp: Type<ControlValueAccessor>) {
  describe(name, () => {
    testFormFieldDirectiveViewBinding<string>({
      initialValue: 'initial',
      newValues: ['new'],
      create(...args) {
        @Component({
    template: '<app-custom-input [formField]="myForm"></app-custom-input>',
    imports: [customControlComp, FormalDirectivesModule]
})
        class TestComponent {
          readonly myForm = form(...args);
        }

        TestBed.configureTestingModule({
          imports: [TestComponent],
        }).compileComponents();
        const fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        TestBed.flushEffects();
        fixture.detectChanges();

        const element = () => fixture.nativeElement.querySelector('input');

        return {
          form() {
            return fixture.componentInstance.myForm;
          },
          viewValue() {
            return element().value;
          },
          isDisabled() {
            return element().disabled;
          },
          fixture() {
            return fixture;
          },
          setViewValue(value: string) {
            const input = fixture.nativeElement.querySelector('input');
            input.value = value;
            input.dispatchEvent(new Event('input'));
          },
          touch() {
            const input = fixture.nativeElement.querySelector('input');
            input.dispatchEvent(new Event('blur'));
          },
        };
      },
    });
  });
}
