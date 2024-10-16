import { expectTypeOf } from 'expect-type';
import { Form, form, FormValue } from 'formal';
import { RecordFormValue } from '../form';
import { isRecordForm } from './record-form';

describe('record form utility', () => {
  it('isRecordForm', () => {
    const myForm = form<FormValue>({});
    expect(isRecordForm(myForm)).toBe(true);
    if (isRecordForm(myForm)) {
      expectTypeOf(myForm).toEqualTypeOf<Form<RecordFormValue>>();
    }

    const myForm1 = form<{ x: number }>({ x: 1 });
    expect(isRecordForm(myForm)).toBe(true);
    if (isRecordForm(myForm1)) {
      expectTypeOf(myForm1).toEqualTypeOf<Form<{ x: number }>>();
    }

    const myForm2 = form<{ x: number }[] | { x: number }>([{ x: 1 }]);
    expect(isRecordForm(myForm2)).toBe(false);
    if (isRecordForm(myForm2)) {
      expectTypeOf(myForm2).toEqualTypeOf<Form<{ x: number }>>();
    }
  });
});
