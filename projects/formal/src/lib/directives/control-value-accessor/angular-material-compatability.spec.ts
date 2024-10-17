import { Component, Directive, DoCheck, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { disabledIf, formalDirectives, required, withValidators } from 'formal';
import { Form, FormValue, form } from '../../form';

@Directive({
  selector: '[matInput]',
  standalone: true,
})
class MatInputDirective implements DoCheck {
  ngControl = inject(NgControl, {
    optional: true,
    self: true,
  });

  constructor() {}

  ngDoCheck() {
    console.log(this.ngControl);
    console.log(this.ngControl?.control);
    console.log(this.ngControl?.control?.hasValidator(Validators.required));
  }
}

function createComponentFixtureWithForm<T extends FormValue>(form: Form<T>) {
  @Component({
    selector: 'app-root',
    template: `
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input [formField]="myForm" matInput />
      </mat-form-field>
    `,
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
      MatInputDirective,
    ],
    declarations: [AppComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(AppComponent);
  TestBed.flushEffects();
  fixture.detectChanges();
  TestBed.flushEffects();
  fixture.detectChanges();

  return fixture;
}

describe('angular material compatibility', () => {
  it('not required', () => {
    const fixture = createComponentFixtureWithForm(form('Hello, World!'));
    expect(
      fixture.nativeElement.querySelector('.mdc-floating-label--required'),
    ).toBeFalsy();
  });

  it('required', () => {
    const fixture = createComponentFixtureWithForm(
      form('', [withValidators(required('Name is required'))]),
    );
    expect(
      fixture.nativeElement.querySelector('.mdc-floating-label--required'),
    ).toBeTruthy();
  });

  it('valid', () => {
    const fixture = createComponentFixtureWithForm(
      form('', [withValidators(() => null)]),
    );

    expect(
      fixture.nativeElement.querySelector('mat-form-field').classList,
    ).not.toContain('mat-form-field-invalid');
  });

  it('invalid', () => {
    const fixture = createComponentFixtureWithForm(
      form('', [withValidators(() => 'Error!')]),
    );

    expect(
      fixture.nativeElement.querySelector('mat-form-field').classList,
    ).toContain('mat-form-field-invalid');
  });

  it('enabled', () => {
    const fixture = createComponentFixtureWithForm(
      form('', [disabledIf(false)]),
    );
    expect(
      fixture.nativeElement.querySelector('mat-form-field').classList,
    ).not.toContain('mat-form-field-disabled');
  });

  it('disabled', () => {
    const fixture = createComponentFixtureWithForm(
      form('', [disabledIf(true)]),
    );
    expect(
      fixture.nativeElement.querySelector('mat-form-field').classList,
    ).toContain('mat-form-field-disabled');
  });
});
