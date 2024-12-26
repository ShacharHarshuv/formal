import { expectTypeOf } from 'expect-type';
import { SignalSpy, signalSpy } from '../utility/signal-spy.spec';
import { form, Form, FormValue, WritableForm } from './form';

describe(form.name, () => {
  it('should be created', () => {
    const myForm = form({
      name: 'Sweeney',
    });
    expect(myForm()).toEqual({
      name: 'Sweeney',
    });
  });

  describe('should infer value type', () => {
    it('string', () => {
      const myForm = form('Sweeney');
      expectTypeOf(myForm()).toEqualTypeOf<string>();
      expectTypeOf(myForm.set).parameter(0).toEqualTypeOf<string>();
      expectTypeOf(myForm.update)
        .parameter(0)
        .toEqualTypeOf<(value: string) => string>();
    });

    it('union', () => {
      const myForm = form<'blue' | 'red'>('blue');
      expectTypeOf(myForm()).toEqualTypeOf<'blue' | 'red'>();
      expectTypeOf(myForm.set).parameter(0).toEqualTypeOf<'blue' | 'red'>();
      expectTypeOf(myForm.update)
        .parameter(0)
        .toEqualTypeOf<(value: 'blue' | 'red') => 'blue' | 'red'>();
    });

    it('number', () => {
      const myForm = form(42);
      expectTypeOf(myForm()).toEqualTypeOf<number>();
      expectTypeOf(myForm.set).parameter(0).toEqualTypeOf<number>();
      expectTypeOf(myForm.update)
        .parameter(0)
        .toEqualTypeOf<(value: number) => number>();
    });

    it('boolean', () => {
      const myForm = form(true);
      expectTypeOf(myForm()).toEqualTypeOf<boolean>();
      expectTypeOf(myForm.set).parameter(0).toEqualTypeOf<boolean>();
      expectTypeOf(myForm.update)
        .parameter(0)
        .toEqualTypeOf<(value: boolean) => boolean>();
    });

    it('record', () => {
      const myForm = form({
        name: 'Sweeney',
        age: 42,
      });

      expectTypeOf(myForm()).branded.toEqualTypeOf<{
        name: string;
        age: number;
      }>();
      expectTypeOf(myForm.set).parameter(0).branded.toEqualTypeOf<{
        name: string;
        age: number;
      }>();
      expectTypeOf(myForm.update).parameter(0).branded.toEqualTypeOf<
        (value: { name: string; age: number }) => {
          name: string;
          age: number;
        }
      >();
    });

    it('union of different types', () => {
      const myForm = form<{ name: string } | null>({ name: 'Sweeney' });

      expectTypeOf(myForm()).toEqualTypeOf<{ name: string } | null>();
      expectTypeOf(myForm).not.toMatchTypeOf<{ fields: number }>();
    });

    it('array', () => {
      const myForm = form(['one', 'two', 'three']);
      expectTypeOf(myForm()).toEqualTypeOf<string[]>();
      expectTypeOf(myForm.set).parameter(0).toEqualTypeOf<string[]>();
      expectTypeOf(myForm.update)
        .parameter(0)
        .toEqualTypeOf<(value: string[]) => string[]>();
    });

    it('array with different types', () => {
      const myForm = form(['one', 2 /*, true*/]); // TODO: booleans are currently not inferred correctly. See https://github.com/microsoft/TypeScript/issues/59993
      expectTypeOf(myForm()).toEqualTypeOf<
        (string | number) /* | boolean*/[]
      >();
      expectTypeOf(myForm.update)
        .parameter(0)
        .toEqualTypeOf<
          (
            value: (string | number) /* | boolean*/[],
          ) => (string | number) /* | boolean*/[]
        >();
    });
  });

  it('types should be invariant', () => {
    let form1 = form(1);
    // @ts-expect-error
    const form2: WritableForm<number | string> = form1;
    // @ts-expect-error
    form1 = form2;
  });

  it('readonly form should be contravariant', () => {
    let form1: Form<number> = form(1);

    const form2: Form<number | string> = form1;

    // @ts-expect-error
    form1 = form2;
  });

  describe('mutating', () => {
    test('primitive', {
      initialValue: 'Sweeney',
      newValue: 'Todd',
      update: {
        fn: (value: string) => value + ' Todd',
        expected: 'Sweeney Todd',
      },
    });

    test('record', {
      initialValue: {
        name: 'Sweeney',
        age: 42,
      },
      newValue: {
        name: 'Todd',
        age: 43,
      },
      update: {
        fn: (value: { name: string; age: number }) => ({
          name: value.name + ' Todd',
          age: value.age + 1,
        }),
        expected: {
          name: 'Sweeney Todd',
          age: 43,
        },
      },
    });

    test('array', {
      initialValue: ['one', 'two', 'three'],
      newValue: ['one', 'two', 'three', 'four'],
      update: {
        fn: (value: string[]) => [...value, 'four'],
        expected: ['one', 'two', 'three', 'four'],
      },
    });

    function test<T extends FormValue>(
      description: string,
      {
        initialValue,
        newValue,
        update,
      }: {
        initialValue: T;
        newValue: T;
        update: {
          fn: (value: T) => T;
          expected: T;
        };
      },
    ) {
      describe(description, () => {
        let myForm: WritableForm<any>;
        let expectLastValueToEqual: SignalSpy<T>['expectLastValueToEqual'];

        beforeEach(() => {
          myForm = form(initialValue);
          expectLastValueToEqual = signalSpy(
            myForm,
            'myForm',
          ).expectLastValueToEqual;
        });

        it('should have initial value', () => {
          expectLastValueToEqual(initialValue);
        });

        it('should update on set', () => {
          myForm.set(newValue);
          expectLastValueToEqual(newValue);
        });

        it('should update on update', () => {
          myForm.update(update.fn);
          expectLastValueToEqual(update.expected);
        });
      });
    }
  });

  describe('fields', () => {
    describe('should be typed correctly', () => {
      describe('records', () => {
        it('primitive values', () => {
          const myForm = form({
            name: 'Sweeney',
            age: 42,
          });

          expectTypeOf(myForm.fields()).branded.toEqualTypeOf<{
            readonly name: WritableForm<string>;
            readonly age: WritableForm<number>;
          }>();
        });

        it('nested objects / arrays', () => {
          const myForm = form({
            name: 'Sweeney',
            address: {
              street: 'Fleet',
              number: 123,
            },
            kids: ['Joanna', 'Toby'],
          });

          expectTypeOf(myForm.fields()).branded.toEqualTypeOf<{
            readonly name: WritableForm<string>;
            readonly address: WritableForm<{
              street: string;
              number: number;
            }>;
            readonly kids: WritableForm<string[]>;
          }>();
        });

        it('only optional properties', () => {
          const myForm = form<{
            name?: string;
          }>({});

          expectTypeOf(myForm.fields()).branded.toEqualTypeOf<{
            readonly name?: WritableForm<string>;
          }>();
        });

        it('optional properties', () => {
          const myForm = form<{
            name: string;
            partner?: string;
          }>({
            name: 'Sweeney',
          });

          expectTypeOf(myForm.fields()).branded.toEqualTypeOf<{
            readonly name: WritableForm<string>;
            readonly partner?: WritableForm<string>;
          }>();
        });

        it('should conserve type', () => {
          type MyFormValue = { name: string };
          const value: MyFormValue = { name: 'Sweeney' };
          const myForm = form(value);
          expectTypeOf(myForm).branded.toEqualTypeOf<
            WritableForm<MyFormValue>
          >();
        });
      });

      describe('arrays', () => {
        it('primitive value', () => {
          const myForm = form(['one', 'two', 'three']);
          expectTypeOf(myForm.fields()).toEqualTypeOf<
            readonly WritableForm<string>[]
          >();
        });

        it('nested object', () => {
          const myForm = form([
            {
              name: 'Sweeney',
            },
          ]);

          expectTypeOf(myForm.fields()).toEqualTypeOf<
            readonly WritableForm<{ name: string }>[]
          >();
        });
      });
    });

    describe('should have field property', () => {
      it('records', () => {
        const myForm = form({
          name: 'Sweeney',
          age: 42,
          address: {
            street: 'Fleet',
            number: 123,
          },
        });
        expect(myForm.fields()).toEqual({
          name: jasmine.anything(),
          age: jasmine.anything(),
          address: jasmine.anything(),
        });
        expect(myForm.fields().name()).toEqual('Sweeney');
        expect(myForm.fields().age()).toEqual(42);

        expect(myForm.fields().address.fields()).toEqual({
          street: jasmine.anything(),
          number: jasmine.anything(),
        });
        expect(myForm.fields().address.fields().street()).toEqual('Fleet');
        expect(myForm.fields().address.fields().number()).toEqual(123);
      });

      it('arrays', () => {
        const myForm = form(['one', 'two', 'three']);
        expect(myForm.fields()).toEqual([
          jasmine.anything(),
          jasmine.anything(),
          jasmine.anything(),
        ]);
        expect(myForm.fields()[0]()).toEqual('one');
        expect(myForm.fields()[1]()).toEqual('two');
        expect(myForm.fields()[2]()).toEqual('three');
      });
    });

    describe('setting values should cause emission for children fields', () => {
      it('records', () => {
        const myForm = form({
          name: 'Sweeney',
          age: 42,
          address: {
            street: 'Fleet',
            number: 123,
          },
        });

        // let's use testSignalChange
        const expectLastNameToEqual = signalSpy(
          myForm.fields().name,
          'name',
        ).expectLastValueToEqual;
        const expectLastAgeToEqual = signalSpy(
          myForm.fields().age,
          'age',
        ).expectLastValueToEqual;
        const expectLastAddressToEqual = signalSpy(
          myForm.fields().address,
          'address',
        ).expectLastValueToEqual;
        const expectLastStreetToEqual = signalSpy(
          myForm.fields().address.fields().street,
          'street',
        ).expectLastValueToEqual;

        myForm.set({
          name: 'Todd',
          age: 43,
          address: {
            street: 'Fleez',
            number: 321,
          },
        });

        expectLastNameToEqual('Todd');
        expectLastAgeToEqual(43);
        expectLastAddressToEqual({
          street: 'Fleez',
          number: 321,
        });
        expectLastStreetToEqual('Fleez');
      });

      it('arrays', () => {
        const myForm = form(['one', 'two', 'three']);
        const spys = myForm.fields().map((field, index) => {
          return signalSpy(field, `field ${index}`);
        });

        const newValue = ['one!', 'two!', 'three!'];
        myForm.set(newValue);

        spys.forEach((spy, index) => {
          spy.expectLastValueToEqual(newValue[index]);
        });
      });
    });

    describe('should cause emission for parent field when children fields change', () => {
      it('records', () => {
        const myForm = form({
          name: 'Sweeney',
          age: 42,
          address: {
            street: 'Fleet',
            number: 123,
          },
        });

        const expectLastFormToEqual = signalSpy(
          myForm,
          'form',
        ).expectLastValueToEqual;

        myForm.fields().name.set('Todd');

        expectLastFormToEqual({
          name: 'Todd',
          age: 42,
          address: {
            street: 'Fleet',
            number: 123,
          },
        });

        myForm.fields().age.set(43);

        expectLastFormToEqual({
          name: 'Todd',
          age: 43,
          address: {
            street: 'Fleet',
            number: 123,
          },
        });

        myForm.fields().address.set({
          street: 'Fleez',
          number: 321,
        });

        expectLastFormToEqual({
          name: 'Todd',
          age: 43,
          address: {
            street: 'Fleez',
            number: 321,
          },
        });

        myForm.fields().address.fields().number.set(322);

        expectLastFormToEqual({
          name: 'Todd',
          age: 43,
          address: {
            street: 'Fleez',
            number: 322,
          },
        });
      });

      it('arrays', () => {
        const myForm = form(['one', 'two', 'three']);
        const expectLastValueToEqual = signalSpy(
          myForm,
          'form',
        ).expectLastValueToEqual;
        myForm.fields()[0].set('one!');
        expectLastValueToEqual(['one!', 'two', 'three']);

        myForm.fields()[1].set('two!');
        expectLastValueToEqual(['one!', 'two!', 'three']);
      });
    });

    describe('fields change', () => {
      describe("shouldn't change if fields haven't change", () => {
        it('records', () => {
          const myForm = form({
            name: 'Sweeney',
          });

          const fieldsSpy = signalSpy(myForm.fields, 'fields');

          fieldsSpy.expectLastValueToEqual(jasmine.anything());

          myForm.set({
            name: 'Todd',
          });

          fieldsSpy.expectValueToNotChange();
        });

        it('arrays', () => {
          const myForm = form(['one', 'two', 'three']);
          const fieldsSpy = signalSpy(myForm.fields, 'fields');

          fieldsSpy.expectLastValueToEqual(jasmine.anything());

          myForm.set(['one', 'two', 'three']);

          fieldsSpy.expectValueToNotChange();
        });
      });

      describe('should be changed if fields have changed', () => {
        it('records', () => {
          const myForm = form<{ name: string; partner?: string }>({
            name: 'Sweeney',
          });

          const fieldsSpy = signalSpy(myForm.fields, 'fields');

          const originalValue = fieldsSpy.lastValue();

          myForm.set({
            name: 'Todd',
            partner: 'Mrs. Lovett',
          });

          const value2 = fieldsSpy.lastValue();
          expect(value2).toEqual({
            name: jasmine.anything(),
            partner: jasmine.anything(),
          });
          expect(originalValue).not.toBe(value2);

          myForm.set({
            name: 'Todd',
          });

          const value3 = fieldsSpy.lastValue();
          expect(value3).toEqual({
            name: jasmine.anything(),
          });
          expect(value3).not.toBe(value2);
          expect(value3).not.toBe(originalValue);
        });

        it('arrays', () => {
          const myForm = form(['one', 'two', 'three']);
          const fieldsSpy = signalSpy(myForm.fields, 'fields');

          const originalValue = fieldsSpy.lastValue();
          expect(originalValue.length).toEqual(3);

          myForm.set(['one!', 'two!', 'three', 'four!']);

          const newValue = fieldsSpy.lastValue();

          expect(newValue.length).toEqual(4);
          expect(newValue).not.toBe(originalValue);
          expect(originalValue.length).toEqual(3);
        });
      });

      it('records > previous fields should be conserved', () => {
        const myForm = form<{ name: string; partner?: string }>({
          name: 'Sweeney',
        });
        const nameField = myForm.fields().name;

        expect(nameField()).toEqual('Sweeney');

        myForm.set({
          name: 'Todd',
          partner: 'Mrs. Lovett',
        });

        expect(nameField()).toBe('Todd');
      });
    });

    describe('should conserve inner fields in initialization', () => {
      it('records', () => {
        const nameField = form('Sweeney');
        const myForm = form({ name: nameField });
        expectTypeOf(myForm).branded.toEqualTypeOf<
          WritableForm<{ name: string }>
        >();
        expect(myForm.fields().name).toBe(nameField);
      });

      it('arrays', () => {
        const nameField = form('Sweeney');
        const myForm = form([nameField]);
        expectTypeOf(myForm).branded.toEqualTypeOf<WritableForm<string[]>>();
        expect(myForm.fields()[0]).toBe(nameField);
      });
    });

    describe('should allow passing both inner fields and values', () => {
      it('records', () => {
        const nameField = form('Sweeney');
        const myForm = form({ name: nameField, age: 42 });
        expectTypeOf(myForm).branded.toEqualTypeOf<
          WritableForm<{ name: string; age: number }>
        >();
        expect(myForm.fields().name).toBe(nameField);
        expect(myForm.fields().age()).toBe(42);
      });

      it('arrays', () => {
        const nameField = form('Sweeney');
        const myForm = form([nameField, 'two']);
        expectTypeOf(myForm).branded.toEqualTypeOf<WritableForm<string[]>>();
        expect(myForm.fields()[0]).toBe(nameField);
        expect(myForm.fields()[1]()).toBe('two');
      });
    });

    describe('should allow passing inner fields when supplying to form type explicitly', () => {
      it('records', () => {
        const nameField = form('Sweeney');
        const myForm = form<{ name: string; age: number }>({
          name: nameField,
          age: 42,
        });
        expectTypeOf(myForm).branded.toEqualTypeOf<
          WritableForm<{ name: string; age: number }>
        >();
        expect(myForm.fields().name).toBe(nameField);
      });

      it('arrays', () => {
        const nameField = form('Sweeney');
        const myForm = form<string[]>([nameField, 'two']);
        expectTypeOf(myForm).branded.toEqualTypeOf<WritableForm<string[]>>();
        expect(myForm.fields()[0]).toBe(nameField);
      });
    });
  });
});
