import { expectTypeOf } from 'expect-type';
import { nullable } from './nullable';

describe('nullable', () => {
  it('should return identity', () => {
    expect(nullable(1)).toBe(1);
    expect(nullable('a')).toBe('a');
    expect(nullable<number | null>(null)).toBe(null);
  });

  it('type inference', () => {
    const value1 = nullable(1);
    expectTypeOf<typeof value1>().toEqualTypeOf<number | null>();

    const value2 = nullable('a');
    expectTypeOf<typeof value2>().toEqualTypeOf<string | null>();

    const value3 = nullable<number | null>(null);
    expectTypeOf<typeof value3>().toEqualTypeOf<number | null>();
  });
});
