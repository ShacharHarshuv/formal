import {
  Directive,
  Injectable,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { WritableForm } from 'formal';
import { bindDisableAttributeDirective } from './bind-disable-attribute';
import { FormFieldDirective } from './form-field.directive';
import { injectSetProperty } from './set-property';

@Injectable({ providedIn: 'root' })
export class RadioControlRegistry {
  private _formToDirectives = new Map<
    WritableForm<string>,
    RadioFormFieldDirective<any>[]
  >();

  get(form: WritableForm<any>) {
    let directives = this._formToDirectives.get(form);
    if (!directives) {
      directives = [];
      this._formToDirectives.set(form, directives);
    }

    return {
      add: (directive: RadioFormFieldDirective<any>) => {
        directives.push(directive);
      },
      remove: (directive: RadioFormFieldDirective<any>) => {
        const index = directives?.indexOf(directive);
        if (index !== undefined && index !== -1) {
          directives?.splice(index, 1);
        }
        this._formToDirectives.delete(form);
      },
      select(directive: RadioFormFieldDirective<any>) {
        directives.forEach((d) => {
          if (d !== directive) {
            d.uncheck();
          }
        });
      },
    };
  }
}

@Directive({
  selector: 'input[type=radio][formField]',
  standalone: true,
  host: { '(change)': 'onCheck()', '(blur)': 'onTouched()' },
})
export class RadioFormFieldDirective<
  T extends string,
> extends FormFieldDirective<T> {
  readonly value = input.required<NoInfer<T>>();
  readonly setProperty = injectSetProperty();
  readonly registry = inject(RadioControlRegistry);
  readonly groupRegistry = computed(() => {
    return this.form && this.registry.get(this.form);
  });

  constructor() {
    super();
    effect((onCleanup) => {
      this.groupRegistry() && this.groupRegistry()!.add(this);

      onCleanup(() => {
        this.groupRegistry() && this.groupRegistry()!.remove(this);
      });
    });
    bindDisableAttributeDirective(() => this.form);
    this._onChange((value) => {
      this.setProperty('checked', value === this.value());
    });
  }

  uncheck() {
    this.setProperty('checked', false);
  }

  onCheck() {
    this.viewValueChange(this.value());
    this.groupRegistry()?.select(this);
  }
}
