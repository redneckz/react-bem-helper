import zip from 'lodash/zip';
import {Config} from '../config';
import {
    isValidNamePart, isValidComponentName,
    assertNamePart
} from './bem-naming-validators';

Config.ASSERTION_ENABLED = true;

describe('BEM naming validators', () => {
    const VALID_NAME_PARTS = ['foo', 'foo-bar', 'foo-bar-baz'];
    const EMPTY_VALUES = ['', null, undefined];

    describe('isValidNamePart', () => {
        it('should treat hyphen separated names as valid BEM names', () => {
            VALID_NAME_PARTS.forEach((name) => {
                expect(isValidNamePart(name)).toBeTruthy();
            });
        });

        it('should treat empty names as invalid BEM names', () => {
            EMPTY_VALUES.forEach((name) => {
                expect(isValidNamePart(name)).toBeFalsy();
            });
        });

        it('should treat names with upper case letters as invalid BEM names', () => {
            ['Foo', 'foO', 'boo-Bar', 'bar-Baz'].forEach((name) => {
                expect(isValidNamePart(name)).toBeFalsy();
            });
        });

        it('should treat names with non hyphen separators as invalid BEM names', () => {
            ['foo_bar', 'foo__bar', 'boo--bar', 'bar.bar', 'bar,bar', 'bar!bar'].forEach((name) => {
                expect(isValidNamePart(name)).toBeFalsy();
            });
        });
    });

    describe('assertNamePart', () => {
        it('should be silent in case of valid BEM names', () => {
            VALID_NAME_PARTS.forEach((name) => {
                expect(() => assertNamePart(name)).not.toThrow();
            });
        });

        it('should fail in case of empty names', () => {
            EMPTY_VALUES.forEach((name) => {
                expect(() => assertNamePart(name)).toThrow();
            });
        });
    });

    describe('isValidComponentName', () => {
        it('should check component name (PascalCase or camelCase) against BEM name (kebab-case)', () => {
            [['Foo', 'foo'], ['FooBar', 'foo-bar'], ['FooBarBaz', 'foo-bar-baz']].forEach(
                ([componentName, name]) => {
                    expect(isValidComponentName(componentName, name)).toBeTruthy();
                }
            );
        });
        it('should fail in case of empty names', () => {
            [zip(EMPTY_VALUES, EMPTY_VALUES)].forEach(
                ([componentName, name]) => {
                    expect(isValidComponentName(componentName, name)).toBeFalsy();
                }
            );
        });
    });
});
