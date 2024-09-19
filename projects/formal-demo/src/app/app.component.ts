import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  form,
  formalDirectives,
} from 'formal';
import { CustomFormFieldNumberComponent } from '../custom-form-field-number/custom-form-field-number.component';
import { CustomValueAccessorNumberFieldComponent } from '../custom-value-accessor-number-field/custom-value-accessor-number-field.component';
import { disabledIf } from '../../../formal/src/lib/form/state/disabled';

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
  ],
})
export class AppComponent {
  readonly disabledForm = form('I\'m Disabled', [disabledIf('Disabled Demo')]);

  form = form({
    name: 'Sweeney Todd',
    age: 42,
    gender: 'male',
  });

  save() {
    alert(JSON.stringify(this.form(), null, 2));
  }
}
