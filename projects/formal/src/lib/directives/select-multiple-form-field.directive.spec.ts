import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  form,
  FormalDirectivesModule,
  SelectMultipleFormFieldDirective,
  WritableForm,
} from 'formal';
import { testFormFieldDirectiveViewBinding } from './test-form-field-directive-view-binding.spec';

describe(SelectMultipleFormFieldDirective.name, () => {
  testFormFieldDirectiveViewBinding<string[]>({
    initialValue: ['1'],
    newValues: [[], ['2'], ['1', '2']],
    create(...args) {
      @Component({
        template: ` <select [formField]="myForm" multiple>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>`,
        imports: [FormalDirectivesModule],
        standalone: true,
      })
      class TestComponent {
        readonly myForm: WritableForm<string[]> = form(...args);
      }

      TestBed.configureTestingModule({
        imports: [TestComponent],
      }).compileComponents();
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const element = () =>
        fixture.nativeElement.querySelector('select') as HTMLSelectElement;

      return {
        form() {
          return fixture.componentInstance.myForm;
        },
        viewValue() {
          return Array.from(element().selectedOptions).map(
            ({ value }) => value,
          );
        },
        isDisabled() {
          return element().disabled;
        },
        fixture() {
          return fixture;
        },
        setViewValue(value: string[]) {
          const optionElements = element().querySelectorAll('option');
          for (const option of Array.from(optionElements)) {
            option.selected = value.includes(option.value);
          }
          element().dispatchEvent(new Event('change'));
        },
        touch() {
          element().dispatchEvent(new Event('blur'));
        },
      };
    },
  });
});
