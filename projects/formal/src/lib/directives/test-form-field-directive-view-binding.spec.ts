import { signal } from '@angular/core';
import { FormValue, WritableForm, form, isDirty } from 'formal';
import { disabledIf } from '../form/state/disabled/disabled';
import { isTouched } from '../form/state/touched/touched';

export function testFormFieldDirectiveViewBinding<T extends FormValue>({
  initialValue,
  newValues,
  create,
}: {
  initialValue: T;
  newValues: T[];
  create(...args: Parameters<typeof form<T>>): {
    form(): WritableForm<T>;
    viewValue(): T;
    isDisabled(): boolean;
    fixture(): {
      detectChanges(): void;
    };
    setViewValue: (value: T) => void;
    touch: () => void;
  };
}) {
  let viewInterface: ReturnType<typeof create>;

  describe('no states', () => {
    beforeEach(() => {
      viewInterface = create(initialValue);
    });

    it('should display initial value', () => {
      expect(viewInterface.viewValue()).toEqual(initialValue);
      expect(isDirty(viewInterface.form())).toBe(false);
    });

    newValues.forEach((newValue) => {
      describe(`New Value: ${newValue}`, () => {
        it('should update form -> view', () => {
          viewInterface.form().set(newValue);
          viewInterface.fixture().detectChanges();
          expect(viewInterface.viewValue()).toEqual(newValue);
          expect(isDirty(viewInterface.form())).toBe(false);
        });

        it('should view -> form', () => {
          viewInterface.setViewValue(newValue);
          viewInterface.fixture().detectChanges();
          expect(viewInterface.form()()).toEqual(newValue);
          expect(isDirty(viewInterface.form())).toBe(true);
        });
      });
    });

    it('should be marked as touched', () => {
      viewInterface.touch();
      viewInterface.fixture().detectChanges();
      expect(isTouched(viewInterface.form())).toBe(true);
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
