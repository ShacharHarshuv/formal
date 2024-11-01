import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RadioFormFieldDirective, form, formalDirectives } from 'formal';
import { testFormFieldDirectiveViewBinding } from './test-form-field-directive-view-binding.spec';

describe(RadioFormFieldDirective.name, () => {
  testFormFieldDirectiveViewBinding<'1' | '2'>({
    initialValue: '1',
    newValues: ['2'],
    create(...args) {
      @Component({
        template: `
          <label>
            <input [formField]="myForm" type="radio" value="1" />
            1
          </label>
          <label>
            <input [formField]="myForm" type="radio" value="2" />
            2
          </label>
        `,
        imports: [formalDirectives],
        standalone: true,
      })
      class TestComponent {
        readonly myForm = form(...args);
      }

      TestBed.configureTestingModule({
        imports: [TestComponent],
      }).compileComponents();
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const radio1 = () =>
        fixture.nativeElement.querySelector(
          'input[value="1"]',
        ) as HTMLInputElement;

      const radio2 = () =>
        fixture.nativeElement.querySelector(
          'input[value="2"]',
        ) as HTMLInputElement;

      return {
        form() {
          return fixture.componentInstance.myForm;
        },
        viewValue() {
          if (radio1().checked && !radio2().checked) {
            return '1';
          }
          if (!radio1().checked && radio2().checked) {
            return '2';
          }
          throw new Error('Only one radio should be checked');
        },
        isDisabled() {
          if (radio1().disabled !== radio2().disabled) {
            throw new Error('Both radios should be disabled or enabled');
          }

          return radio1().disabled && radio2().disabled;
        },
        fixture() {
          return fixture;
        },
        setViewValue(value: string) {
          if (value === '1') {
            radio1().click();
          } else if (value === '2') {
            radio2().click();
          } else {
            throw new Error(`Invalid value ${value}`);
          }
        },
        touch() {
          radio1().dispatchEvent(new Event('blur'));
        },
      };
    },
  });
});
