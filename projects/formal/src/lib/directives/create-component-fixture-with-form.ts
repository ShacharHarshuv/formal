import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Form, formalDirectives } from 'formal';

export function createComponentFixtureWithForm(form: Form<string>) {
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

  return [
    Object.assign(fixture, {
      changeViewValue(value: string) {
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
    }),
    fixture.nativeElement.querySelector('input') as HTMLInputElement,
  ] as const;
}
