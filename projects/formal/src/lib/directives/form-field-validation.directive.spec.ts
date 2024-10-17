import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Form, form, formalDirectives, withValidators } from 'formal';

function createComponentFixtureWithForm(form: Form<string>) {
  @Component({
    selector: 'app-root',
    template: ` <input [formField]="myForm" type="text" /> `,
  })
  class AppComponent {
    readonly myForm = form;
  }

  TestBed.configureTestingModule({
    imports: [
      MatFormFieldModule,
      MatInputModule,
      formalDirectives,
      NoopAnimationsModule,
    ],
    declarations: [AppComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(AppComponent);
  TestBed.flushEffects();
  fixture.detectChanges();
  TestBed.flushEffects();
  fixture.detectChanges();

  return [fixture, fixture.nativeElement.querySelector('input')];
}

describe('FormFieldValidationDirective', () => {
  it('valid', () => {
    const [fixture, inputElm] = createComponentFixtureWithForm(
      form('Hello, World!'),
    );
    expect(inputElm.classList).toContain('ng-valid');
    expect(inputElm.classList).not.toContain('ng-invalid');
    expect(inputElm.classList).not.toContain('ng-pending');
  });

  it('invalid', () => {
    const [fixture, inputElm] = createComponentFixtureWithForm(
      form('', [withValidators(() => 'error!')]),
    );
    expect(inputElm.classList).toContain('ng-invalid');
    expect(inputElm.classList).not.toContain('ng-valid');
    expect(inputElm.classList).not.toContain('ng-pending');
  });
});
