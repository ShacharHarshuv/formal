type BroadenToNearestPrimitive<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends bigint
        ? bigint
        : T extends symbol
          ? symbol
          : T extends undefined
            ? undefined
            : T extends null
              ? null
              : T;

export function nullable<T>(value: T): BroadenToNearestPrimitive<T> | null {
  return value as BroadenToNearestPrimitive<T>;
}
