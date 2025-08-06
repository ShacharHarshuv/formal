import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormalDirectivesModule } from 'formal';
import { testFormFieldDirectiveViewBinding } from './test-form-field-directive-view-binding.spec';

describe('NativeStringFormFieldDirective', () => {
  beforeEach(() => {});

  ['input', 'textarea'].forEach((tagName) => {
    describe(tagName, () => {
      testFormFieldDirectiveViewBinding({
        initialValue: 'initial',
        newValues: ['new'],
        create(...args) {
          @Component({
    template: `
              <input [formField]="myForm" type="text" />
              <textarea [formField]="myForm"></textarea>
              <!--TODO(#1): add support for non-textual types: range, color, checkbox, radio, file, date, number -->
            `,
    imports: [FormalDirectivesModule]
})
          class TestComponent {
            readonly myForm = form(...args);
          }

          TestBed.configureTestingModule({
            imports: [TestComponent],
          }).compileComponents();
          const fixture = TestBed.createComponent(TestComponent);
          fixture.detectChanges();

          const element = () => fixture.nativeElement.querySelector(tagName);

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
              element().value = value;
              element().dispatchEvent(new Event('input'));
            },
            touch() {
              element().dispatchEvent(new Event('blur'));
            },
          };
        },
      });
    });
  });
});
