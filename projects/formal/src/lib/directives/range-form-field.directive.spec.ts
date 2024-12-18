import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Form, form, formalDirectives } from 'formal';
import { RangeFormFieldDirective } from './range-form-field.directive';
import { testFormFieldDirectiveViewBinding } from './test-form-field-directive-view-binding.spec';

describe(RangeFormFieldDirective.name, () => {
  testFormFieldDirectiveViewBinding<number>({
    initialValue: 1,
    newValues: [2],
    create(...args) {
      @Component({
        template: ` <input [formField]="myForm" type="range" /> `,
        imports: [formalDirectives],
        standalone: true,
      })
      class TestComponent {
        readonly myForm: Form<number> = form(...args);
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
          return +element().value;
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
        touch() {
          element().dispatchEvent(new Event('blur'));
        },
      };
    },
  });
});
