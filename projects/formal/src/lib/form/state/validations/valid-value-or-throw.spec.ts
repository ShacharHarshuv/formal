import { expectTypeOf } from 'expect-type';
import { form, FormValue, required, withValidators } from 'formal';
import { ReadonlyForm } from '../../form';
import { validValueOrThrow } from './valid-value-or-throw';

describe(validValueOrThrow.name, () => {
  it('return type', () => {
    const validationFn = required();
    const stateFactory: <T extends FormValue>(
      form: ReadonlyForm<T, T & Exclude<FormValue, null | undefined | ''>>,
    ) => void = withValidators(validationFn);
    const stateFactory2 = stateFactory;
    const myForm = form(null as string | null, [stateFactory]);
    expectTypeOf(validValueOrThrow(myForm)).toEqualTypeOf<string>();
  });
});
