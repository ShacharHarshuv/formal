import { Component } from '@angular/core';
import {
  form,
  FORM_FIELD_DIRECTIVES,
} from 'formal';
import { MatInputModule } from '@angular/material/input';
import { NgStyle } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    MatInputModule,
    NgStyle,
    ReactiveFormsModule,
    MatCheckboxModule,
    ...FORM_FIELD_DIRECTIVES,
  ],
})
export class AppComponent {
  name = form('initial');
  checked = form(true);
}
