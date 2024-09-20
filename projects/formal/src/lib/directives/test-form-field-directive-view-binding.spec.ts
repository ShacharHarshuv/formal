import { signal } from '@angular/core';
import { Form, FormValue, form } from 'formal';
import { disabledIf } from '../form/state/disabled/disabled';

export function testFormFieldDirectiveViewBinding<T extends FormValue>({
  initialValue,
  newValue,
  create,
}: {
  initialValue: T;
  newValue: T;
  create(...args: Parameters<typeof form<T>>): {
    form(): Form<T>;
    viewValue(): T;
    isDisabled(): boolean;
    fixture(): {
      detectChanges(): void;
    };
    setViewValue: (value: T) => void;
  };
}) {
  let viewInterface: ReturnType<typeof create>;

  describe('no states', () => {
    beforeEach(() => {
      viewInterface = create(initialValue);
    });

    it('should display initial value', () => {
      expect(viewInterface.viewValue()).toEqual(initialValue);
    });

    it('should update form -> view', () => {
      viewInterface.form().set(newValue);
      viewInterface.fixture().detectChanges();
      expect(viewInterface.viewValue()).toEqual(newValue);
    });

    it('should view -> form', () => {
      viewInterface.setViewValue(newValue);
      viewInterface.fixture().detectChanges();
      expect(viewInterface.form()()).toEqual(newValue);
    });
  });

  describe('disabled', () => {
    it('should not be disabled initially', () => {
      viewInterface = create(initialValue);
      expect(viewInterface.isDisabled()).toBe(false);
    });

    it('should reflect static value', () => {
      viewInterface = create(initialValue, [disabledIf(true)]);
      expect(viewInterface.isDisabled()).toBe(true);
    });

    it('should react to changes', () => {
      const shouldDisable = signal(false);
      viewInterface = create(initialValue, [disabledIf(shouldDisable)]);
      expect(viewInterface.isDisabled()).toBe(false);

      shouldDisable.set(true);
      viewInterface.fixture().detectChanges();
      expect(viewInterface.isDisabled()).toBe(true);
    });
  });
}
