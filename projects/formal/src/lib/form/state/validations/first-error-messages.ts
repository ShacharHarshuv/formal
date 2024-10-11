import { first } from 'lodash';
import { Form } from '../../form';
import { errorMessages } from './error-messages';

export function firstErrorMessage(form: Form) {
  return first(errorMessages(form)) ?? null;
}
