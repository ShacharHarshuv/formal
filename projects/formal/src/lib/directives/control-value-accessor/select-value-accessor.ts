import {
  ControlValueAccessor,
  DefaultValueAccessor,
  NgControl,
} from '@angular/forms';

function isBuiltInAccessor(valueAccessor: ControlValueAccessor): boolean {
  // Check if a given value accessor is an instance of a class that directly extends
  // `BuiltInControlValueAccessor` one.
  return (
    Object.getPrototypeOf(valueAccessor.constructor).name ===
    'BuiltInControlValueAccessor'
  );
}

export function selectValueAccessor(
  valueAccessors: readonly ControlValueAccessor[] | null,
): ControlValueAccessor | null {
  if (!valueAccessors) {
    return null;
  }

  if (!Array.isArray(valueAccessors)) {
    throw new Error(
      `${valueAccessors} is not a valid CONTROL_VALUE_ACCESSOR value. It needs to be an array.`,
    );
  }

  let defaultAccessor: ControlValueAccessor | undefined = undefined;
  let builtinAccessor: ControlValueAccessor | undefined = undefined;
  let customAccessor: ControlValueAccessor | undefined = undefined;

  valueAccessors.forEach((v: ControlValueAccessor) => {
    if (v.constructor === DefaultValueAccessor) {
      defaultAccessor = v;
    } else if (isBuiltInAccessor(v)) {
      if (builtinAccessor) {
        throw new Error(
          'More than one built-in value accessor matches form control',
        );
      }
      builtinAccessor = v;
    } else {
      if (customAccessor) {
        throw new Error(
          'More than one custom value accessor matches form control',
        );
      }
      customAccessor = v;
    }
  });

  if (customAccessor) {
    return customAccessor;
  }
  if (builtinAccessor) {
    return builtinAccessor;
  }
  if (defaultAccessor) {
    return defaultAccessor;
  }

  return null;
}
