import { Component } from '@angular/core';
import {
  form,
  DefaultFormDirective,
} from 'formal';
import {
  TestBed,
  ComponentFixture,
} from '@angular/core/testing';

@Component({
  template: `
    <input type="text" [formField]="myForm">
    <textarea [formField]="myForm"></textarea>
    <!--TODO(#1): add support for non-textual types: range, color, checkbox, radio, file, date, number -->
  `,
  imports: [
    DefaultFormDirective,
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
      it('should display initial value', () => {
        const input = fixture.nativeElement.querySelector(tagName);
        expect(input.value).toBe('initial');
      });

      it('should update form -> view', () => {
        fixture.componentInstance.myForm.set('updated');
        fixture.detectChanges();
        const input = fixture.nativeElement.querySelector(tagName);
        expect(input.value).toBe('updated');
      });

      it('should view -> form', () => {
        const input = fixture.nativeElement.querySelector(tagName);
        input.value = 'updated';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(fixture.componentInstance.myForm()).toBe('updated');
      })
    });
  });
});
