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
  isValid,
  min,
  required,
  withValidators,
} from 'formal';
import { CustomFormFieldNumberComponent } from '../custom-form-field-number/custom-form-field-number.component';
import { CustomValueAccessorNumberFieldComponent } from '../custom-value-accessor-number-field/custom-value-accessor-number-field.component';

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
    const age = form(42, [withValidators(min(13, 'Must be at least 13'))]);

    return form({
      name: form('Sweeney Todd', [
        withValidators(required('Name is required')),
      ]),
      age: age,
      gender: 'male',
      partner: form('', [
        disabledIf(() =>
          age() < 18 ? 'You must be 18 or older to have a partner' : null,
        ),
      ]),
    });
  })();

  isValid = computed(() => isValid(this.form));

  disabledReason = computed(() => firstErrorMessage(this.form) ?? '');

  save() {
    alert(JSON.stringify(this.form(), null, 2));
  }
}
