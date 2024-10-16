import { expectTypeOf } from 'expect-type';
import { form } from '../form';
import { FieldDescriptor, fieldsDescriptors } from './fields-descriptors';

describe('fieldsDescriptors', () => {
  it('primitives', () => {
    const myForm = form(1);
    const fieldDescriptors = fieldsDescriptors(myForm);
    expect(fieldDescriptors).toEqual([]);
    expectTypeOf(fieldDescriptors).toEqualTypeOf<[]>();
  });

  it('record', () => {
    const myForm = form({ a: 1, b: '2' });
    const fieldDescriptors = fieldsDescriptors(myForm);
    expect(fieldDescriptors).toEqual([
      { form: myForm.fields().a, position: 'a' },
      { form: myForm.fields().b, position: 'b' },
    ]);
    expectTypeOf(fieldDescriptors).toEqualTypeOf<
      FieldDescriptor<number | string, 'a' | 'b'>[]
    >();
  });

  it('array', () => {
    const myForm = form([1, '2']);
    const fieldDescriptors = fieldsDescriptors(myForm);
    expect(fieldDescriptors).toEqual([
      { form: myForm.fields()[0], position: 0 },
      { form: myForm.fields()[1], position: 1 },
    ]);
    expectTypeOf(fieldDescriptors).toEqualTypeOf<
      FieldDescriptor<number | string, number>[]
    >();
  });
});
