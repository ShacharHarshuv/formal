import {
  Signal,
  computed,
} from '@angular/core';
import {
  Form,
  FormValue,
} from 'formal';
import {
  FORM,
  StateFactory,
} from '../form';
import { toGetter } from '../../utility/static-or-getter';

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
    createState: (
      form: Form<TFormValue>,
      ...args: Args
    ) => State | Signal<State>;
  },
) {
  const symbol = Symbol(description);

  const stateFactory =
    (...args: Args): StateFactory<TFormValue> =>
      (form) => {
        const state = computed(() => {
          return toGetter(config.createState(form, ...args))();
        })

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
