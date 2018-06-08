// @flow
import { capitalize } from './capitalize';

describe('capitalize', () => {
    it('should pull up first letter', () => {
        expect(capitalize('foo')).toBe('Foo');
        expect(capitalize('foo bar')).toBe('Foo bar');
        expect(capitalize('foo-bar-baz')).toBe('Foo-bar-baz');
    });

    it('should pull down all letters except the first one', () => {
        expect(capitalize('fOo')).toBe('Foo');
        expect(capitalize('foO BaR')).toBe('Foo bar');
        expect(capitalize('foO-bAr-bAz')).toBe('Foo-bar-baz');
    });

    it('should leave empty string as is', () => {
        expect(capitalize('')).toBe('');
    });

    it('should transform nil values to empty string', () => {
        expect(capitalize(undefined)).toBe('');
        expect(capitalize(null)).toBe('');
        expect(capitalize()).toBe('');
    });

    it('should transform non-string values to string', () => {
        expect(capitalize(true)).toBe('True');
        expect(capitalize(123)).toBe('123');
    });
});
