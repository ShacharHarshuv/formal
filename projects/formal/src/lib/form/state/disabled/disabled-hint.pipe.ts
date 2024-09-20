import { Pipe, PipeTransform } from '@angular/core';
import { Form } from '../../form';
import { disabledHint } from './disabled';

@Pipe({
  name: 'disabledHint',
  standalone: true,
  pure: false,
})
export class DisabledHintPipe implements PipeTransform {
  transform(form: Form) {
    return disabledHint(form);
  }
}
