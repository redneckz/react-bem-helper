import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import {Config} from '../config';
import {
    isValidNamePart, isValidComponentName, isValidModifierComponentName,
    assertNamePart
} from './bem-naming-validators';

Config.ASSERTION_ENABLED = true;

describe('BEM naming validators', () => {
    const VALID_NAME_PARTS = ['foo', 'foo-bar', 'foo-bar-baz'];
    const EMPTY_VALUES = ['', null, undefined];
    const WITH_INVALID_CASE = ['Foo', 'foO', 'boo-Bar', 'bar-Baz'];
    const WITH_INVALID_SEPARATORS = ['foo_bar', 'foo__bar', 'boo--bar', 'bar.bar', 'bar,bar', 'bar!bar'];

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
            WITH_INVALID_CASE.forEach((name) => {
                expect(isValidNamePart(name)).toBeFalsy();
            });
        });

        it('should treat names with non hyphen separators as invalid BEM names', () => {
            WITH_INVALID_SEPARATORS.forEach((name) => {
                expect(isValidNamePart(name)).toBeFalsy();
            });
        });
    });

    describe('isValidComponentName', () => {
        it(`should check that component name (PascalCase or camelCase)
            equals to corresponding BEM name (kebab-case)`, () => {
            [['Foo', 'foo'], ['FooBar', 'foo-bar'], ['FooBarBaz', 'foo-bar-baz']].forEach(
                ([componentName, name]) => {
                    expect(isValidComponentName(componentName, name)).toBeTruthy();
                }
            );
            [['FooQuux', 'foo'], ['FooBarQuux', 'foo-bar'], ['FooBarBazQuux', 'foo-bar-baz']].forEach(
                ([componentName, name]) => {
                    expect(isValidComponentName(componentName, name)).toBeFalsy();
                }
            );
        });

        it('should be truthy in case of empty component name (for components defined as arrow functions)', () => {
            [...WITH_INVALID_CASE, ...WITH_INVALID_SEPARATORS, ...EMPTY_VALUES].forEach(
                (name) => {
                    expect(isValidComponentName('', name)).toBeTruthy();
                }
            );
        });

        it('should be falsy if invalid BEM name provided', () => {
            [...WITH_INVALID_CASE, ...WITH_INVALID_SEPARATORS].forEach(
                (name) => {
                    const componentName = upperFirst(camelCase(name));
                    expect(isValidComponentName(componentName, name)).toBeFalsy();
                }
            );
        });
    });

    describe('isValidModifierComponentName', () => {
        it(`should check that component name (PascalCase or camelCase)
            starts with corresponding BEM name (kebab-case)`, () => {
            [['FooQuux', 'foo'], ['FooBarQuux', 'foo-bar'], ['FooBarBazQuux', 'foo-bar-baz']].forEach(
                ([componentName, name]) => {
                    expect(isValidModifierComponentName(componentName, name)).toBeTruthy();
                }
            );
            [['Foo', 'xyzzy'], ['FooBar', 'xyzzy-bar'], ['FooBarBaz', 'xyzzy-bar-baz']].forEach(
                ([componentName, name]) => {
                    expect(isValidModifierComponentName(componentName, name)).toBeFalsy();
                }
            );
        });

        it('should be truthy in case of empty component name (for components defined as arrow functions)', () => {
            [...WITH_INVALID_CASE, ...WITH_INVALID_SEPARATORS, ...EMPTY_VALUES].forEach(
                (name) => {
                    expect(isValidModifierComponentName('', name)).toBeTruthy();
                }
            );
        });

        it('should be falsy if invalid BEM name provided', () => {
            [...WITH_INVALID_CASE, ...WITH_INVALID_SEPARATORS].forEach(
                (name) => {
                    const componentName = upperFirst(camelCase(name));
                    expect(isValidModifierComponentName(componentName, name)).toBeFalsy();
                }
            );
        });
    });

    describe('assertNamePart', () => {
        it('should be silent in case of valid BEM names', () => {
            VALID_NAME_PARTS.forEach((name) => {
                expect(() => assertNamePart(name)).not.toThrow();
            });
        });

        it('should fail in case of invalid or empty BEM names', () => {
            [...WITH_INVALID_CASE, ...WITH_INVALID_SEPARATORS, ...EMPTY_VALUES].forEach((name) => {
                expect(() => assertNamePart(name)).toThrow();
            });
        });
    });
});
