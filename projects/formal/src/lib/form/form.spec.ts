import {
  form,
  Form,
} from './form';
import {
  effect,
  Injector,
  computed,
  Component,
} from '@angular/core';
import {
  TestBed,
  ComponentFixture,
} from '@angular/core/testing';
import { toObservable } from '@angular/core/rxjs-interop';

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
    let myForm: Form<{
      name: string,
    }>;
    let changeSpy = jasmine.createSpy('changeSpy');
    let fixture: ComponentFixture<unknown>;

    function expectLastValueToEqual(value: {
      name: string,
    }) {
      fixture.detectChanges();
      expect(myForm()).toEqual(value);
      expect(changeSpy.calls.mostRecent().args[0]).toEqual(value);
    }

    beforeEach(() => {
      myForm = form({
        name: 'Sweeney',
      });

      @Component({template: ''})
      class MyComponent {
        constructor() {
          effect(() => {
            changeSpy(myForm());
          });
        }
      }

      fixture = TestBed.createComponent(MyComponent);
    });

    it('should have initial value', () => {
      expectLastValueToEqual({
        name: 'Sweeney',
      });
    });

    it('should update on set', () => {
      myForm.set({
        name: 'Todd',
      });
      expectLastValueToEqual({
        name: 'Todd',
      });
    });

    it('should update on update', () => {
      myForm.update(value => ({
        name: value.name + ' Todd',
      }));
      expectLastValueToEqual({
        name: 'Sweeney Todd',
      });
    })
  })
});
