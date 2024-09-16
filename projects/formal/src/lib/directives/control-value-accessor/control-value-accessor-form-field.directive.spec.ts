import { Component, forwardRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { form, FORM_FIELD_DIRECTIVES } from 'formal';
import { testFormFieldDirectiveViewBinding } from '../test-form-field-directive-view-binding.spec';

@Component({
  selector: 'app-custom-input',
  template: `<input [value]="value" (input)="onInput($event)" />`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
  standalone: true,
  host: {
    // to test for potential ExpressionChangedAfterItHasBeenCheckedError
    '[class.custom-input]': 'value',
  },
})
export class CustomInputComponent implements ControlValueAccessor {
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

const INITIAL_VALUE = 'initial';

@Component({
  template: '<app-custom-input [formField]="myForm"></app-custom-input>',
  standalone: true,
  imports: [CustomInputComponent, ...FORM_FIELD_DIRECTIVES],
})
export class TestComponent {
  readonly myForm = form(INITIAL_VALUE);
}

describe('ControlValueAccessorFormFieldDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
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
