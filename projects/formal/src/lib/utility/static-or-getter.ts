export type StaticOrGetter<T, Args extends any[] = []> =
  | T
  | ((...args: Args) => T);

export function toGetter<T, Args extends any[] = []>(
  staticOrGetter: StaticOrGetter<T, Args>,
): (...args: Args) => T {
  if (staticOrGetter instanceof Function) {
    return staticOrGetter;
  } else {
    return (...args: Args) => staticOrGetter;
  }
}
