import {createBlockNameFactory, createElementNameFactory} from './bem-naming-factory';
import {Config} from '../config';

Config.ASSERTION_ENABLED = true;
const {ELEMENT_SEPARATOR, MODIFIER_SEPARATOR} = Config;

describe('BEM naming factory', () => {
    const INVALID_NAME_PARTS = ['Foo', 'fooBar', 'foo_bar', 'foo--bar', ' '];
    const EMPTY_VALUES = ['', null, undefined];

    describe('createBlockNameFactory', () => {
        it('should return block name if empty modifier provided', () => {
            const fooBlockNameFactory = createBlockNameFactory('foo');
            expect(fooBlockNameFactory()).toEqual('foo');
        });

        it('should compute valid BEM name using configured separators', () => {
            const fooBlockNameFactory = createBlockNameFactory('foo-bar');
            expect(fooBlockNameFactory('baz')).toEqual(`foo-bar${MODIFIER_SEPARATOR}baz`);
        });

        it('should accept "classnames" compatible structures as modifier', () => {
            const fooBlockNameFactory = createBlockNameFactory('foo-bar');
            expect(fooBlockNameFactory({
                baz: true,
                quux: false
            })).toEqual({
                [`foo-bar${MODIFIER_SEPARATOR}baz`]: true,
                [`foo-bar${MODIFIER_SEPARATOR}quux`]: false
            });
        });

        it('should translate camelCase modifiers to kebab-case', () => {
            const fooBlockNameFactory = createBlockNameFactory('foo-bar');
            expect(fooBlockNameFactory({
                bazQuux: true
            })).toEqual({
                [`foo-bar${MODIFIER_SEPARATOR}baz-quux`]: true
            });
        });

        it('should fail in case of invalid block name', () => {
            [...INVALID_NAME_PARTS, ...EMPTY_VALUES].forEach((block) => {
                expect(() => createBlockNameFactory(block)).toThrow();
            });
        });
    });

    describe('createElementNameFactory', () => {
        it('should compute valid BEM name using configured separators', () => {
            const elementNameFactory = createElementNameFactory('foo-bar', 'baz');
            expect(elementNameFactory())
                .toEqual(`foo-bar${ELEMENT_SEPARATOR}baz`);
            expect(elementNameFactory('quux'))
                .toEqual(`foo-bar${ELEMENT_SEPARATOR}baz${MODIFIER_SEPARATOR}quux`);
        });

        it('should accept "classnames" compatible structures as modifier', () => {
            const elementNameFactory = createElementNameFactory('foo', 'bar');
            expect(elementNameFactory({
                baz: true,
                quux: false
            })).toEqual({
                [`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}baz`]: true,
                [`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}quux`]: false
            });
        });

        it('should translate camelCase modifiers to kebab-case', () => {
            const elementNameFactory = createElementNameFactory('foo', 'bar');
            expect(elementNameFactory({
                bazQuux: true
            })).toEqual({
                [`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}baz-quux`]: true
            });
        });

        it('should fail in case of invalid block name', () => {
            [...INVALID_NAME_PARTS, ...EMPTY_VALUES].forEach((block) => {
                expect(() => createElementNameFactory(block, 'foo')).toThrow();
            });
        });

        it('should fail in case of invalid element name', () => {
            [...INVALID_NAME_PARTS, ...EMPTY_VALUES].forEach((element) => {
                expect(() => createElementNameFactory('foo', element)).toThrow();
            });
        });
    });
});
