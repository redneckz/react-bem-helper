// @flow
import { kebabToCamelCase } from './kebab-to-camel-case';

describe('kebabToCamelCase', () => {
    it('should transform kebab-case strings to camelCase', () => {
        expect(kebabToCamelCase('foo')).toBe('foo');
        expect(kebabToCamelCase('foo-bar')).toBe('fooBar');
        expect(kebabToCamelCase('foo-bar-baz')).toBe('fooBarBaz');
    });

    it('should ignore consequent dash characters', () => {
        expect(kebabToCamelCase('---Foo---')).toBe('foo');
        expect(kebabToCamelCase('--Foo--bar--baZ---')).toBe('fooBarBaz');
    });

    it('should leave camelCase strings as is (unchanged)', () => {
        expect(kebabToCamelCase('foo')).toBe('foo');
        expect(kebabToCamelCase('fooBar')).toBe('fooBar');
        expect(kebabToCamelCase('fooBarBaz')).toBe('fooBarBaz');
    });

    it('should leave empty string as is', () => {
        expect(kebabToCamelCase('')).toBe('');
    });

    it('should transform nil values to empty string', () => {
        expect(kebabToCamelCase(undefined)).toBe('');
        expect(kebabToCamelCase(null)).toBe('');
        expect(kebabToCamelCase()).toBe('');
    });

    it('should transform non-string values to string', () => {
        expect(kebabToCamelCase(true)).toBe('true');
        expect(kebabToCamelCase(123)).toBe('123');
    });
});
