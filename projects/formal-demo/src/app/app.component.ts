import { Component } from '@angular/core';
import {
  form,
  FORM_FIELD_DIRECTIVES,
} from 'formal';
import {
  ReactiveFormsModule,
} from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ...FORM_FIELD_DIRECTIVES,
    JsonPipe,
  ],
})
export class AppComponent {
  form = form({
    name: 'Hello',
    age: 10,
    // gender: 'male',
  });

  save() {
    alert(JSON.stringify(this.form(), null, 2));
  }
}
