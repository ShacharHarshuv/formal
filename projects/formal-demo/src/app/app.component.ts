import { JsonPipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  DisabledHintPipe,
  disabledIf,
  firstErrorMessage,
  form,
  formalDirectives,
  isDirty,
  isPending,
  isValid,
  min,
  nullable,
  required,
  reset,
  withValidators,
} from 'formal';
import { CustomFormFieldNumberComponent } from '../custom-form-field-number/custom-form-field-number.component';
import { CustomValueAccessorNumberFieldComponent } from '../custom-value-accessor-number-field/custom-value-accessor-number-field.component';

function isNameInUse(name: string) {
  console.log('Checking if name is in use...', name);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(name === 'Shahar Har-Shuv');
    }, 2000);
  });
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    JsonPipe,
    MatFormField,
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    CustomValueAccessorNumberFieldComponent,
    CustomFormFieldNumberComponent,
    formalDirectives,
    DisabledHintPipe,
  ],
})
export class AppComponent {
  form = (() => {
    const age = form(nullable(42), [
      withValidators(min(13, 'Must be at least 13')),
    ]);

    return form({
      name: form('', [
        withValidators(required('Name is required'), async (form) =>
          (await isNameInUse(form())) ? 'Name is already in use' : null,
        ),
      ]),
      age: age,
      gender: 'male' as 'male' | 'female',
      partner: form('', [
        disabledIf(() => {
          if (age() === null) {
            return 'Please specify your age first';
          }

          return age()! < 18
            ? 'You must be 18 or older to have a partner'
            : null;
        }),
      ]),
    });
  })();

  private _initialValue = this.form();

  isValid = computed(() => isValid(this.form));

  disabledReason = computed(() => firstErrorMessage(this.form) ?? '');

  save() {
    alert(JSON.stringify(this.form(), null, 2));
  }

  protected readonly isPending = isPending;
  protected readonly firstErrorMessage = firstErrorMessage;
  protected readonly isDirty = isDirty;

  reset() {
    reset(this.form, this._initialValue);
  }
}
