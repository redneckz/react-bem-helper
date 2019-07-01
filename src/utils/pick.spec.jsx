// @flow
import { pick } from './pick';

describe('pick', () => {
  it('should pick only whitelisted keys from object and produce the new one', () => {
    const whitelist = ['foo', 'bar'];
    const foo = {};
    const bar = {};
    const obj = { foo, bar, quux: 123 };
    const pruned = pick(whitelist)(obj);
    expect(Object.keys(pruned)).toEqual(whitelist);
    expect(pruned.foo).toBe(foo);
    expect(pruned.bar).toBe(bar);
  });

  it('should return empty object if empty value provided', () => {
    const whitelist = ['foo'];
    expect(pick(whitelist)()).toEqual({});
    expect(pick(whitelist)(null)).toEqual({});
    expect(pick(whitelist)(undefined)).toEqual({});
  });

  it('should return empty object if whitelist is empty', () => {
    const obj = { foo: 123 };
    expect(pick()(obj)).toEqual({});
    expect(pick([])(obj)).toEqual({});
    expect(pick(null)(obj)).toEqual({});
    expect(pick(undefined)(obj)).toEqual({});
  });
});
