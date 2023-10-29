import {
  Component,
  effect,
} from '@angular/core';
import {
  form,
  DefaultFormDirective,
} from 'formal';
import { MatInputModule } from '@angular/material/input';
import { NgStyle } from '@angular/common';
import {
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    MatInputModule,
    NgStyle,
    DefaultFormDirective,
    ReactiveFormsModule,
  ],
})
export class AppComponent {
  name = form('initial');
  fc = new FormControl('initial')

  constructor() {
  }
}
