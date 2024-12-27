import { Signal } from '@angular/core';
import { FORM, Form, FormValue, StateFactory } from '../form';

export function defineFormState<
  State,
  Args extends any[],
  TFormValue extends FormValue = FormValue,
>(
  description: string,
  config: {
    /**
     * The state value read for forms that have not been explicitly initialized with one
     * */
    default: NoInfer<State>;
    /**
     * An immutable and reactive state that will be created once when the form initializes
     * */
    createState: <T extends TFormValue>(
      form: Form<T>,
      ...args: Args
    ) => Signal<State>;
  },
) {
  const symbol = Symbol(description);

  const stateFactory =
    <T extends TFormValue, TArgs extends Args>(
      ...args: TArgs
    ): StateFactory<T> =>
    (form) => {
      const state = config.createState(form, ...args);

      if ((form[FORM] as any)[symbol]) {
        throw new Error(
          `Cannot use "${description}" on the same form more than once. Please make sure you initialize your form with one "${description}" once`,
        );
      }

      (form[FORM] as any)[symbol] = state;
    };

  const readState = (form: Form<TFormValue>) => {
    const stateSignal = (form[FORM] as any)?.[symbol] as
      | Signal<State>
      | undefined;
    return stateSignal?.() ?? config.default;
  };

  return [readState, stateFactory] as const;
}
