import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormalDirectivesModule, WritableForm } from 'formal';
import { CheckboxFormFieldDirective } from './checkbox-form-field.directive';
import { testFormFieldDirectiveViewBinding } from './test-form-field-directive-view-binding.spec';

describe(CheckboxFormFieldDirective.name, () => {
  testFormFieldDirectiveViewBinding<boolean>({
    initialValue: false,
    newValues: [true],
    create(...args) {
      @Component({
    template: ` <input [formField]="myForm" type="checkbox" /> `,
    imports: [FormalDirectivesModule]
})
      class TestComponent {
        readonly myForm: WritableForm<boolean> = form(...args);
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
          return element().checked;
        },
        isDisabled() {
          return element().disabled;
        },
        fixture() {
          return fixture;
        },
        setViewValue(value: boolean) {
          if (value !== element().checked) {
            element().click();
          }
        },
        touch() {
          element().dispatchEvent(new Event('blur'));
        },
      };
    },
  });
});
