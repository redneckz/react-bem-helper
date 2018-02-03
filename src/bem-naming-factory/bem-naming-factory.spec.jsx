import {blockClassNames, elementClassNames} from './bem-naming-factory';
import {Config} from '../config';

const {ELEMENT_SEPARATOR, MODIFIER_SEPARATOR} = Config;

describe('BEM naming factory', () => {
    describe('blockClassNames', () => {
        it('should return block name if no modifiers provided', () => {
            expect(blockClassNames('foo')()).toEqual(['foo']);
        });

        it('should return block name and block name suffixed with modifier (if any)', () => {
            expect(blockClassNames('foo')(['quux'])).toEqual([
                'foo',
                `foo${MODIFIER_SEPARATOR}quux`
            ]);
        });

        it('should return block name and block name suffixed with modifier for each of them', () => {
            expect(blockClassNames('foo')(['quux', 'plugh'])).toEqual([
                'foo',
                `foo${MODIFIER_SEPARATOR}quux`,
                `foo${MODIFIER_SEPARATOR}plugh`
            ]);
        });

        it('should transform each modifier to kebab-case', () => {
            expect(blockClassNames('foo')(['QuuxPlugh'])).toEqual([
                'foo',
                `foo${MODIFIER_SEPARATOR}quux-plugh`
            ]);
        });

        it('should fail if no block name provided', () => {
            expect(() => blockClassNames()).toThrow();
        });
    });

    describe('elementClasNames', () => {
        it('should return element name if no modifiers provided', () => {
            expect(elementClassNames('foo', 'bar')()).toEqual([`foo${ELEMENT_SEPARATOR}bar`]);
        });

        it('should return element name and element name suffixed with modifier (if any)', () => {
            expect(elementClassNames('foo', 'bar')(['quux'])).toEqual([
                `foo${ELEMENT_SEPARATOR}bar`,
                `foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}quux`
            ]);
        });

        it('should return element name and element name suffixed with modifier for each of them', () => {
            expect(elementClassNames('foo', 'bar')(['quux', 'plugh'])).toEqual([
                `foo${ELEMENT_SEPARATOR}bar`,
                `foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}quux`,
                `foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}plugh`
            ]);
        });

        it('should transform each modifier to kebab-case', () => {
            expect(elementClassNames('foo', 'bar')(['QuuxPlugh'])).toEqual([
                `foo${ELEMENT_SEPARATOR}bar`,
                `foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}quux-plugh`
            ]);
        });

        it('should fail if no block name provided', () => {
            expect(() => elementClassNames()).toThrow();
        });

        it('should fail if no element name provided', () => {
            expect(() => elementClassNames('foo')).toThrow();
        });
    });
});
