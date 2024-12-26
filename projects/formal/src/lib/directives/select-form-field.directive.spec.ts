import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { WritableForm, form, formalDirectives } from 'formal';
import { SelectFormFieldDirective } from './select-form-field.directive';
import { testFormFieldDirectiveViewBinding } from './test-form-field-directive-view-binding.spec';

describe(SelectFormFieldDirective.name, () => {
  testFormFieldDirectiveViewBinding<string>({
    initialValue: '1',
    newValues: ['2'],
    create(...args) {
      @Component({
        template: ` <select [formField]="myForm">
          <option value="1">1</option>
          <option value="2">2</option>
        </select>`,
        imports: [formalDirectives],
        standalone: true,
      })
      class TestComponent {
        readonly myForm: WritableForm<string> = form(...args);
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
          element().dispatchEvent(new Event('change'));
        },
        touch() {
          element().dispatchEvent(new Event('blur'));
        },
      };
    },
  });
});
