import {
  form,
  Form,
  FormValue,
} from './form';
import {
  effect,
  Injector,
  computed,
  Component,
  Signal,
} from '@angular/core';
import {
  TestBed,
  ComponentFixture,
} from '@angular/core/testing';
import { toObservable } from '@angular/core/rxjs-interop';
import Expected = jasmine.Expected;

export function signalSpy<T>(signal: Signal<T>, name: string) {
  let fixture: ComponentFixture<unknown>;

  let changeSpy = jasmine.createSpy(`${name} spy`);

  function expectLastValueToEqual(value: Expected<T>) {
    fixture.detectChanges();
    expect(signal()).toEqual(value);
    expect(changeSpy.calls.mostRecent().args[0]).toEqual(value);
  }

  function expectValueToNotChange() {
    const callsCount = changeSpy.calls.count();
    fixture.detectChanges();
    expect(changeSpy.calls.count()).toEqual(callsCount);
  }

  @Component({template: ''})
  class MyComponent {
    constructor() {
      effect(() => {
        changeSpy(signal());
      });
    }
  }

  fixture = TestBed.createComponent(MyComponent);

  return {
    expectLastValueToEqual,
    expectValueToNotChange,
  };
}

export type SignalSpy<T> = ReturnType<typeof signalSpy>;

describe(form.name, () => {
  it('should be created', () => {
    const myForm = form({
      name: 'Sweeney',
    });
    expect(myForm()).toEqual({
      name: 'Sweeney',
    });
  });

  describe('mutating', () => {
    test({
      initialValue: 'Sweeney',
      newValue: 'Todd',
      update: {
        fn: (value: string) => value + ' Todd',
        expected: 'Sweeney Todd',
      },
    });

    test({
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

    function test<T extends FormValue>({
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
    }) {
      let myForm: Form<any>;
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
    }
  });

  describe('fields as records', () => {
    let myForm: Form<{
      name: string;
      age: number;
      address: {
        street: string;
        number: number;
      };
      partner?: string;
    }>;

    beforeEach(() => {
      myForm = form({
        name: 'Sweeney',
        age: 42,
        address: {
          street: 'Fleet',
          number: 123,
        },
      });
    });

    it('should have field property for objects', () => {
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

    it('setting values should cause emission for children fields', () => {
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
    });

    it('should cause emission for parent field when children fields change', () => {
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
    });

    describe('fields change', () => {
      it("shouldn't change if fields haven't change", () => {
        const formSpy = signalSpy(myForm.fields, 'fields');

        formSpy.expectLastValueToEqual(jasmine.anything());

        myForm.set({
          name: 'Todd',
          age: 43,
          address: {
            street: 'Fleez',
            number: 321,
          },
        });

        formSpy.expectValueToNotChange();
      });

      it('should be changed if fields have changed', () => {
        const fieldsSpy = signalSpy(myForm.fields, 'fields');

        fieldsSpy.expectLastValueToEqual(jasmine.anything());

        myForm.set({
          name: 'Todd',
          age: 43,
          address: {
            street: 'Fleez',
            number: 321,
          },
          partner: 'Mrs. Lovett',
        });

        fieldsSpy.expectLastValueToEqual({
          name: jasmine.anything(),
          age: jasmine.anything(),
          address: jasmine.anything(),
          partner: jasmine.anything(),
        });

        myForm.set({
          name: 'Todd',
          age: 43,
          address: {
            street: 'Fleez',
            number: 321,
          }
        });

        fieldsSpy.expectLastValueToEqual({
          name: jasmine.anything(),
          age: jasmine.anything(),
          address: jasmine.anything(),
        });
      });
    });

    // TODO: add ability to set partial values
    // describe('patch', () => {
    //   it('should not change existing values', () => {
    //
    //   });
    // });

    // TODO: add ability to reset value to initial value
    // describe('reset', () => {
    //   it('should reset to initial value', () => {
    //
    //   });

    /**
     * Test:
     *
     * - Fields change when they need to (if we set other fields on change?)
     * - same things for arrays
     * */
  });

  describe('fields as arrays', () => {
    let myForm: Form<string[]>;

    beforeEach(() => {
      myForm = form(['one', 'two', 'three']);
    });

    it('should work', () => {
      const valueSpy = signalSpy(myForm, 'value');
      const fieldsSpy = signalSpy(myForm.fields, 'fields');
      const firstValueSpy = signalSpy(myForm.fields()[0], 'firstValue');

      valueSpy.expectLastValueToEqual(['one', 'two', 'three']);
      firstValueSpy.expectLastValueToEqual('one');
      fieldsSpy.expectLastValueToEqual([
        jasmine.anything(),
        jasmine.anything(),
        jasmine.anything(),
      ]);

      myForm.set(['one!', 'two!', 'three!', 'four!']);

      valueSpy.expectLastValueToEqual(['one!', 'two!', 'three!', 'four!']);
      firstValueSpy.expectLastValueToEqual('one!');
      fieldsSpy.expectLastValueToEqual([
        jasmine.anything(),
        jasmine.anything(),
        jasmine.anything(),
        jasmine.anything(),
      ]);

      myForm.fields()[0].set('one!!');

      valueSpy.expectLastValueToEqual(['one!!', 'two!', 'three!', 'four!']);
      firstValueSpy.expectLastValueToEqual('one!!');
      fieldsSpy.expectValueToNotChange();

      myForm.set(['1', '2', '3', '4']);
      valueSpy.expectLastValueToEqual(['1', '2', '3', '4']);
      firstValueSpy.expectLastValueToEqual('1');
      fieldsSpy.expectValueToNotChange();

      myForm.set(['1', '2', '3']);
      valueSpy.expectLastValueToEqual(['1', '2', '3']);
      firstValueSpy.expectValueToNotChange();
      fieldsSpy.expectLastValueToEqual([
        jasmine.anything(),
        jasmine.anything(),
        jasmine.anything(),
      ]);
    });
  });
});
