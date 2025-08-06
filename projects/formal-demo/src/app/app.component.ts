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
  FormalDirectivesModule,
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

function isNameInUse(name: string, abortSignal: AbortSignal) {
  if (!name) {
    return Promise.resolve(false);
  }
  console.log('Checking if name is in use...', name);
  let timeout: ReturnType<typeof setTimeout>;
  abortSignal.addEventListener('abort', () => {
    clearTimeout(timeout);
    console.log(`Aborting check for "${name}".`);
  });

  return new Promise((resolve) => {
    timeout = setTimeout(() => {
      clearTimeout(timeout);
      const result = name === 'Shahar Har-Shuv';
      console.log(`Check for "${name}" is ${result ? 'good' : 'bad'}.`);

      resolve(result);
    }, 2000);
  });
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
    DisabledHintPipe,
    FormalDirectivesModule,
  ],
})
export class AppComponent {
  form = (() => {
    const age = form(nullable(42), [
      withValidators(min(13, 'Must be at least 13')),
    ]);

    const preferNotToSay = form(false);

    return form({
      name: form('', [
        withValidators(
          required('Name is required'),
          async (form, abortSignal) => {
            return (await isNameInUse(form(), abortSignal))
              ? 'Name is already in use'
              : null;
          },
        ),
      ]),
      age: age,
      range: 0,
      gender: form<'male' | 'female'>('male', [
        disabledIf(() => preferNotToSay()),
      ]),
      preferNotToSay: preferNotToSay,
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
      multipleSelect: form<('a' | 'b' | 'c')[]>(['a']),
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
