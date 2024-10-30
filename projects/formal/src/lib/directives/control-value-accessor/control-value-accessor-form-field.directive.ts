import {
  computed,
  Directive,
  effect,
  forwardRef,
  inject,
  signal,
  untracked,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors as NgValidationErrors,
} from '@angular/forms';
import { ownValidationErrors, validators } from '../../form';
import { FormValue } from '../../form/form';
import { isDirty } from '../../form/state/dirty/dirty';
import { isDisabled } from '../../form/state/disabled/disabled';
import { FormFieldDirective } from '../form-field.directive';
import { selectValueAccessor } from './select-value-accessor';

@Directive({
  selector: '[formField]',
  standalone: true,
  providers: [
    {
      provide: NgControl,
      useExisting: forwardRef(() => ControlValueAccessorFormFieldDirective),
    },
  ],
})
export class ControlValueAccessorFormFieldDirective<
  T extends FormValue,
> extends FormFieldDirective<T> {
  private _valueAccessor = signal<ControlValueAccessor | null>(null);

  set valueAccessor(value: ControlValueAccessor | null) {
    this._valueAccessor.set(value);
  }

  /**
   * This is used for backward compatibility with ReactiveForms in places like Angular Material
   * Do not remove
   * */
  readonly control = this._getPseudoControl();

  get disabled() {
    return this.form ? isDisabled(this.form) : undefined;
  }

  constructor() {
    super();

    this.valueAccessor = selectValueAccessor(
      inject(NG_VALUE_ACCESSOR, {
        optional: true,
        self: true,
      }),
    );

    effect(() => {
      if (!this.form) {
        return;
      }

      const currentValue = this.form();
      currentValue && this._valueAccessor()?.writeValue(currentValue);

      // form -> vca
      this._onChange((value: T) => {
        this._valueAccessor()?.writeValue(value);
      });

      // vca -> form
      this._valueAccessor()?.registerOnChange((value: T) => {
        this.viewValueChange(value);
      });
    });

    const shouldDisable = computed(() =>
      this.form ? isDisabled(this.form) : false,
    );
    effect(() => {
      const value = shouldDisable();
      untracked(() => {
        this._valueAccessor()?.setDisabledState?.(value);
      });
    });
  }

  private _getPseudoControl(): AbstractControl {
    const formControl = new FormControl();

    effect(() => {
      formControl.setValue(this.form?.());
      if (formControl.errors !== errors()) {
        // set value can undesirably clear validations errors
        formControl.setErrors(errors());
      }
    });

    effect(() => {
      const dirty = this.form ? isDirty(this.form) : false;
      if (dirty) {
        formControl.markAsDirty();
        formControl.markAsTouched(); // todo: we need to separate this once we handle this state
      } else {
        formControl.markAsPristine();
        formControl.markAsUntouched();
      }
    });

    const pseudoValidators = computed(() => {
      const _validators = this.form ? validators(this.form) : [];
      return _validators
        .map(({ pseudoNgValidation }) => pseudoNgValidation)
        .filter((value) => !!value);
    });

    effect(() => {
      formControl.setValidators(pseudoValidators());
    });

    const errors = computed((): NgValidationErrors | null => {
      const errors = this.form ? ownValidationErrors(this.form) : [];
      return errors.length > 0
        ? errors.reduce((ngErrors: NgValidationErrors, error) => {
            if (typeof error === 'string') {
              return { ...ngErrors, ...{ [error]: true } };
            }
            return { ...ngErrors, ...error };
          }, {})
        : null;
    });

    effect(() => {
      if (formControl.errors !== errors()) {
        formControl.setErrors(errors());
      }
    });

    // todo: forward untouched, touched, pristine, dirty, and pe
    return formControl;
  }
}
