import {
  Component,
  effect,
} from '@angular/core';
import { form } from 'formal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  name = form('Hello');

  constructor() {
    effect(() => {
      console.log('value', this.name());
    })
  }
}
