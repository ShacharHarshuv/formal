import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { disabledIf, formalDirectives, required, withValidators } from 'formal';
import { WritableForm, form } from '../../form';

function createComponentFixtureWithForm(form: WritableForm<string>) {
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
    ],
    declarations: [AppComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(AppComponent);
  TestBed.flushEffects();
  fixture.detectChanges();
  TestBed.flushEffects();
  fixture.detectChanges();

  return Object.assign(fixture, {
    changeValue(value: string) {
      const inputElm = fixture.nativeElement.querySelector('input');
      inputElm.value = value;
      inputElm.dispatchEvent(new Event('input'));
      TestBed.flushEffects();
      fixture.detectChanges();
    },
    touch() {
      const inputElm = fixture.nativeElement.querySelector('input');
      inputElm.dispatchEvent(new Event('blur'));
      TestBed.flushEffects();
      fixture.detectChanges();
    },
  });
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
    ).not.toBeTruthy();

    fixture.touch();

    expect(
      fixture.nativeElement.querySelector('mat-form-field').classList,
    ).toContain('mat-form-field-invalid');
  });

  it('valid', () => {
    const fixture = createComponentFixtureWithForm(
      form('', [withValidators(() => null)]),
    );

    expect(
      fixture.nativeElement.querySelector('mat-form-field').classList,
    ).not.toContain('mat-form-field-invalid');

    fixture.touch();

    expect(
      fixture.nativeElement.querySelector('mat-form-field').classList,
    ).not.toContain('mat-form-field-invalid');
  });

  it('invalid', () => {
    const fixture = createComponentFixtureWithForm(
      form('', [withValidators(() => 'Error!')]),
    );

    // should not have invalid indication initially
    expect(
      fixture.nativeElement.querySelector('mat-form-field').classList,
    ).not.toContain('mat-form-field-invalid');

    fixture.touch();

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
