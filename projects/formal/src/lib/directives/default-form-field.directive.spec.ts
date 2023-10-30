import { Component } from '@angular/core';
import {
  form,
  DefaultFormFieldDirective,
} from 'formal';
import {
  TestBed,
  ComponentFixture,
} from '@angular/core/testing';
import { testFormFieldDirectiveViewBinding } from './test-form-field-directive-view-binding.spec';

@Component({
  template: `
    <input type="text" [formField]="myForm">
    <textarea [formField]="myForm"></textarea>
    <!--TODO(#1): add support for non-textual types: range, color, checkbox, radio, file, date, number -->
  `,
  imports: [
    DefaultFormFieldDirective,
  ],
  standalone: true,
})
class TestComponent {
  readonly myForm = form('initial');
}

describe('DefaultFormDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestComponent,
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  ['input', 'textarea'].forEach(tagName => {
    describe(tagName, () => {
      testFormFieldDirectiveViewBinding({
        initialValue: 'initial',
        newValue: 'new',
        form() {
          return fixture.componentInstance.myForm;
        },
        viewValue() {
          return fixture.nativeElement.querySelector(tagName).value;
        },
        fixture() {
          return fixture;
        },
        setViewValue(value: string) {
          const input =fixture.nativeElement.querySelector(tagName);
          input.value = value;
          input.dispatchEvent(new Event('input'));
        }
      })
    });
  });
});
