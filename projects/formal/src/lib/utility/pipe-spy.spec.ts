import { Constructor } from '@angular/cdk/schematics';
import { Component, signal, untracked } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { signalSpy } from './signal-spy.spec';

const EMPTY = Symbol('EMPTY');

export function pipeSpy<T, U>(
  pipe: Constructor<{ transform(value: T): U }>,
  pipeName: string,
  initialValue: NoInfer<T>,
) {
  @Component({
    template: `{{ handleValueChange(value | ${pipeName}) }}`,
    standalone: false
})
  class TestComponent {
    currentValue = signal<U | typeof EMPTY>(EMPTY);

    value = initialValue;

    handleValueChange(value: U) {
      untracked(() => {
        this.currentValue.set(value);
      });
      return '';
    }
  }

  TestBed.configureTestingModule({
    declarations: [TestComponent],
    imports: [pipe],
  });

  TestBed.compileComponents();
  const fixture = TestBed.createComponent(TestComponent);

  const valueSpy = signalSpy(
    fixture.componentInstance.currentValue,
    'currentValue',
  );

  function currentValue() {
    fixture.detectChanges();
    const currentValue = valueSpy.lastValue();
    if (currentValue === EMPTY) {
      fail('Expected value to be set');
    }
    return currentValue;
  }

  return {
    currentValue,
    expectValueToNotChange: () => valueSpy.expectValueToNotChange(),
  };
}
