import { Form, FormValue } from 'formal';

export function testFormFieldDirectiveViewBinding<T extends FormValue>({
  initialValue,
  newValue,
  form,
  viewValue,
  fixture,
  setViewValue,
}: {
  initialValue: T;
  newValue: T;
  form(): Form<T>;
  viewValue(): T;
  fixture(): {
    detectChanges(): void;
  };
  setViewValue: (value: T) => void;
}) {
  it('should display initial value', () => {
    expect(viewValue()).toEqual(initialValue);
  });

  it('should update form -> view', () => {
    form().set(newValue);
    fixture().detectChanges();
    expect(viewValue()).toEqual(newValue);
  });

  it('should view -> form', () => {
    setViewValue(newValue);
    fixture().detectChanges();
    expect(form()()).toEqual(newValue);
  });
}
