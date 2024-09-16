import { Component, forwardRef, inject, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { form, FORM_FIELD_DIRECTIVES } from 'formal';
import { testFormFieldDirectiveViewBinding } from '../test-form-field-directive-view-binding.spec';

abstract class AbstractCustomInputComponent implements ControlValueAccessor {
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

  onInput($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}

@Component({
  selector: 'app-custom-input',
  template: `<input [value]="value" (input)="onInput($event)" />`,
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
  template: `<input [value]="value" (input)="onInput($event)" />`,
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

const INITIAL_VALUE = 'initial';

describe('ControlValueAccessorFormFieldDirective', () => {
  test('accessor provided', CustomInputAccessorProvidedComponent);
  test('accessor self inserted', CustomInputAccessorSelfInsertedComponent);
});

function test(name: string, customControlComp: Type<ControlValueAccessor>) {
  describe(name, () => {
    @Component({
      template: '<app-custom-input [formField]="myForm"></app-custom-input>',
      standalone: true,
      imports: [customControlComp, ...FORM_FIELD_DIRECTIVES],
    })
    class TestComponent {
      readonly myForm = form(INITIAL_VALUE);
    }

    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestComponent],
      }).compileComponents();
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      TestBed.flushEffects();
      fixture.detectChanges();
    });

    testFormFieldDirectiveViewBinding({
      initialValue: INITIAL_VALUE,
      newValue: 'new',
      form() {
        return fixture.componentInstance.myForm;
      },
      viewValue() {
        return fixture.nativeElement.querySelector('input').value;
      },
      fixture() {
        return fixture;
      },
      setViewValue(value: string) {
        const input = fixture.nativeElement.querySelector('input');
        input.value = value;
        input.dispatchEvent(new Event('input'));
      },
    });
  });
}
