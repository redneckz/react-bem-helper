// @flow
import { decapitalize } from './decapitalize';

describe('decapitalize', () => {
  it('should pull down first letter', () => {
    expect(decapitalize('Foo')).toBe('foo');
    expect(decapitalize('Foo bar')).toBe('foo bar');
    expect(decapitalize('Foo-bar-baz')).toBe('foo-bar-baz');
  });

  it('should leave all letters untouched except the first one', () => {
    expect(decapitalize('FOo')).toBe('fOo');
    expect(decapitalize('FoO BaR')).toBe('foO BaR');
    expect(decapitalize('FoO-bAr-bAz')).toBe('foO-bAr-bAz');
  });

  it('should leave empty string as is', () => {
    expect(decapitalize('')).toBe('');
  });

  it('should transform nil values to empty string', () => {
    expect(decapitalize(undefined)).toBe('');
    expect(decapitalize(null)).toBe('');
    expect(decapitalize()).toBe('');
  });

  it('should transform non-string values to string', () => {
    expect(decapitalize(true)).toBe('true');
    expect(decapitalize(123)).toBe('123');
  });
});
