import { Pipe, PipeTransform } from '@angular/core';
import { ReadonlyForm } from '../../form';
import { disabledHint } from './disabled';

@Pipe({
  name: 'disabledHint',
  standalone: true,
  pure: false,
})
export class DisabledHintPipe implements PipeTransform {
  transform(form: ReadonlyForm) {
    return disabledHint(form);
  }
}
