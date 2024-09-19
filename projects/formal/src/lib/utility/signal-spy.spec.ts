import {
  Signal,
  Component,
  effect,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import Expected = jasmine.Expected;

export function signalSpy<T>(signal: Signal<T>, name: string) {
  let fixture: ComponentFixture<unknown>;

  let changeSpy = jasmine.createSpy(`${name} spy`);

  function lastValue() {
    fixture.detectChanges();
    if (signal() !== changeSpy.calls.mostRecent().args[0]) {
      fail(`Value change for signal "${name}" have not been notified`);
    }
    return signal();
  }

  function expectLastValueToEqual(value: Expected<T>) {
    fixture.detectChanges();
    expect(signal()).toEqual(value);
    expect(changeSpy.calls.mostRecent().args[0]).toEqual(value);
  }

  function expectValueToNotChange() {
    const callsCount = changeSpy.calls.count();
    const currentValue = signal();
    fixture.detectChanges();
    if (changeSpy.calls.count() > callsCount) {
      fail(`Expected signal "${name}" to not have changed`);
    }
    if (signal() !== currentValue) {
      fail(`Value of signal "${name}" is different than the previous value`);
    }
  }

  @Component({ template: '' })
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
    lastValue,
  };
}

export type SignalSpy<T> = ReturnType<typeof signalSpy>;
