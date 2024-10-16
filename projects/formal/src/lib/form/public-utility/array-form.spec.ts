import { expectTypeOf } from 'expect-type';
import { form, Form, FormValue } from 'formal';
import { ArrayFormValue } from '../form';
import { isArrayForm } from './array-form';

describe('array form utility', () => {
  it('isArrayForm', () => {
    const myForm = form<FormValue>([]);
    expect(isArrayForm(myForm)).toBe(true);
    if (isArrayForm(myForm)) {
      expectTypeOf(myForm).toEqualTypeOf<Form<ArrayFormValue>>();
    }

    const myForm1 = form<{ x: number }[]>([{ x: 1 }]);
    expect(isArrayForm(myForm)).toBe(true);
    if (isArrayForm(myForm1)) {
      expectTypeOf(myForm1).toEqualTypeOf<Form<{ x: number }[]>>();
    }

    const myForm2 = form<{ x: number }[] | { x: number }>({ x: 1 });
    expect(isArrayForm(myForm2)).toBe(false);
    if (isArrayForm(myForm2)) {
      expectTypeOf(myForm2).toEqualTypeOf<Form<{ x: number }[]>>();
    }
  });
});
