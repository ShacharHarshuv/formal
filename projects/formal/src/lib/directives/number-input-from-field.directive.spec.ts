import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  form,
  Form,
  formalDirectives,
  NumberInputFormFieldDirective,
} from 'formal';
import { testFormFieldDirectiveViewBinding } from './test-form-field-directive-view-binding.spec';

describe(NumberInputFormFieldDirective.name, () => {
  testFormFieldDirectiveViewBinding<number | null>({
    initialValue: 1,
    newValues: [2, null],
    create(...args) {
      @Component({
        template: ` <input [formField]="myForm" type="number" /> `,
        imports: [formalDirectives],
        standalone: true,
      })
      class TestComponent {
        readonly myForm: Form<number | null> = form(...args);
      }

      TestBed.configureTestingModule({
        imports: [TestComponent],
      }).compileComponents();
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const element = () => fixture.nativeElement.querySelector('input');

      return {
        form() {
          return fixture.componentInstance.myForm;
        },
        viewValue() {
          const value = element().value;
          return value === '' ? null : +value;
        },
        isDisabled() {
          return element().disabled;
        },
        fixture() {
          return fixture;
        },
        setViewValue(value: number | null) {
          element().value = value === null ? '' : value.toString();
          element().dispatchEvent(new Event('input'));
        },
      };
    },
  });
});
