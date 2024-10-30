import { first } from 'lodash';
import { ReadonlyForm } from '../../form';
import { errorMessages } from './error-messages';

export function firstErrorMessage(form: ReadonlyForm) {
  return first(errorMessages(form)) ?? null;
}
