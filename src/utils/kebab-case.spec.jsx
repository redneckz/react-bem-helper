import {kebabCase} from './kebab-case';

const SEP = '*/+ ^%$#@!&*()~-{}[];:,<>.\t\n\r';

describe('kebabCase', () => {
    it('should transform camelCase string to kebab-case string', () => {
        expect(kebabCase('foo')).toBe('foo');
        expect(kebabCase('fooBar')).toBe('foo-bar');
        expect(kebabCase('fooBarBaz')).toBe('foo-bar-baz');
    });

    it('should NOT separate consequent upper-case characters', () => {
        expect(kebabCase('foo')).toBe('foo');
        expect(kebabCase('fooBAR')).toBe('foo-bar');
        expect(kebabCase('FOoBArBAz')).toBe('foo-bar-baz');
    });

    it('should transform pascalCase string to kebab-case string', () => {
        expect(kebabCase('Foo')).toBe('foo');
        expect(kebabCase('FooBar')).toBe('foo-bar');
        expect(kebabCase('FooBarBaz')).toBe('foo-bar-baz');
    });

    it('should leave kebab-case string as is (unchanged)', () => {
        expect(kebabCase('foo-bar')).toBe('foo-bar');
        expect(kebabCase('foo-bar-baz')).toBe('foo-bar-baz');
    });

    it('should replace consequent dashes with only dash', () => {
        expect(kebabCase('foo--bar')).toBe('foo-bar');
        expect(kebabCase('foo---bar----baz')).toBe('foo-bar-baz');
    });

    it('should consider each non-word character as separator (replacing it with dash)', () => {
        expect(kebabCase(`foo${SEP}bar`)).toBe('foo-bar');
        expect(kebabCase(`foo${SEP}bar${SEP}baz`)).toBe('foo-bar-baz');
        expect(kebabCase(`Foo${SEP}Bar${SEP}Baz`)).toBe('foo-bar-baz');
    });

    it('should ignore non-word characters at beginning and end of string', () => {
        expect(kebabCase(`${SEP}foo${SEP}`)).toBe('foo');
        expect(kebabCase(`${SEP}foo-bar${SEP}`)).toBe('foo-bar');
        expect(kebabCase(`${SEP}foo-bar-baz${SEP}`)).toBe('foo-bar-baz');
    });

    it('should leave empty string as is', () => {
        expect(kebabCase('')).toBe('');
    });

    it('should transform nil value to empty string', () => {
        expect(kebabCase(undefined)).toBe('');
        expect(kebabCase(null)).toBe('');
        expect(kebabCase()).toBe('');
    });
});
