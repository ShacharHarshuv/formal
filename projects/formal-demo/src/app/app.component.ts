import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { form, FORM_FIELD_DIRECTIVES } from 'formal';
import { CustomNumberFieldComponent } from '../custom-number-field/custom-number-field.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    ...FORM_FIELD_DIRECTIVES,
    JsonPipe,
    MatFormField,
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    CustomNumberFieldComponent,
  ],
})
export class AppComponent {
  form = form({
    name: 'Sweeney Todd',
    age: 42,
    gender: 'male',
  });

  save() {
    alert(JSON.stringify(this.form(), null, 2));
  }
}
