import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import isString from 'lodash/isString';
import {Config} from '../config';
import {element} from './element';

Config.ASSERTION_ENABLED = true;
const {ELEMENT_SEPARATOR, MODIFIER_SEPARATOR} = Config;

describe('BEM element decorator', () => {
    let renderer;
    let FooBar;
    beforeEach(() => {
        renderer = new ReactShallowRenderer();
        FooBar = () => <div />;
    });

    it('should have [displayName] containing element name', () => {
        const WrappedFooBar = element('bar')(FooBar);
        expect(WrappedFooBar.displayName).toEqual('element(bar)');
    });

    it('should inject [elementClassName] property', () => {
        const WrappedFooBar = element('bar')(FooBar);
        renderer.render(<WrappedFooBar />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(isString(wrappedFooBar.props.elementClassName)).toBeTruthy();
        expect(wrappedFooBar.props.elementClassName).toEqual(`foo${ELEMENT_SEPARATOR}bar`);
    });

    it('should mixin provided [className] property into [elementClassName] property', () => {
        const WrappedFooBar = element('bar')(FooBar);
        renderer.render(<WrappedFooBar className="quux" />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(isString(wrappedFooBar.props.elementClassName)).toBeTruthy();
        const fooBarClasses = wrappedFooBar.props.elementClassName.split(' ');
        expect(fooBarClasses).toHaveLength(2);
        expect(fooBarClasses).toContain(`foo${ELEMENT_SEPARATOR}bar`);
        expect(fooBarClasses).toContain('quux');
    });

    it('should map properties to modifiers and mixin corresponding classes to [elementClassName]', () => {
        const WrappedFooBar = element(
            'bar',
            ({baz}) => `baz-${baz}`
        )(FooBar);
        renderer.render(<WrappedFooBar baz="quux" />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(isString(wrappedFooBar.props.elementClassName)).toBeTruthy();
        const fooBarClasses = wrappedFooBar.props.elementClassName.split(' ');
        expect(fooBarClasses).toHaveLength(2);
        expect(fooBarClasses).toContain(`foo${ELEMENT_SEPARATOR}bar`);
        expect(fooBarClasses).toContain(`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}baz-quux`);
    });

    it('should accept "classnames" compatible structures as modifier', () => {
        const WrappedFooBar = element(
            'bar',
            ({baz}) => ({notBaz: !baz})
        )(FooBar);
        renderer.render(<WrappedFooBar baz={false} />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(isString(wrappedFooBar.props.elementClassName)).toBeTruthy();
        const fooBarClasses = wrappedFooBar.props.elementClassName.split(' ');
        expect(fooBarClasses).toHaveLength(2);
        expect(fooBarClasses).toContain(`foo${ELEMENT_SEPARATOR}bar`);
        expect(fooBarClasses).toContain(`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}not-baz`);
    });

    it('should pass block modifiers to [mapPropsToModifiers] function as second argument', () => {
        const mapPropsToModifiers = jest.fn().mockReturnValue('quux');
        const WrappedFooBar = element(
            'bar',
            mapPropsToModifiers
        )(FooBar);
        renderer.render(
            <WrappedFooBar />,
            {
                blockName: 'foo',
                blockModifiers: 'xyzzy plugh'
            }
        );
        expect(mapPropsToModifiers).toBeCalledWith(
            {},
            {
                xyzzy: 'xyzzy',
                plugh: 'plugh'
            }
        );
    });

    it('should fail in case of empty context', () => {
        const WrappedFooBar = element('bar')(FooBar);
        expect(() => renderer.render(<WrappedFooBar />)).toThrow(/^\[BEM\].+/);
    });

    it('should fail in case of invalid element name (not kebab-case)', () => {
        expect(() => element('BAR')).toThrow(/^\[BEM\].+/);
    });

    describe('which wraps a component with modular css', () => {
        function checkClasses() {
            const wrappedFooBar = renderer.getRenderOutput();
            expect(isString(wrappedFooBar.props.elementClassName)).toBeTruthy();
            const fooBarClasses = wrappedFooBar.props.elementClassName.split(' ');
            expect(fooBarClasses).toHaveLength(2);
            expect(fooBarClasses).toContain('foo#123');
            expect(fooBarClasses).toContain('quux#456');
        }

        it('should take a class mapping from the static field [styles]', () => {
            FooBar.styles = {
                [`foo${ELEMENT_SEPARATOR}bar`]: 'foo#123',
                [`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}baz-quux`]: 'quux#456'
            };
            const WrappedFooBar = element(
                'bar',
                ({baz}) => `baz-${baz}`
            )(FooBar);
            renderer.render(<WrappedFooBar baz="quux" />, {blockName: 'foo'});
            checkClasses();
        });

        it('should take a class mapping from the context property [blockStyles]', () => {
            const WrappedFooBar = element(
                'bar',
                ({baz}) => `baz-${baz}`
            )(FooBar);
            renderer.render(
                <WrappedFooBar baz="quux" />,
                {
                    blockName: 'foo',
                    blockStyles: {
                        [`foo${ELEMENT_SEPARATOR}bar`]: 'foo#123',
                        [`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}baz-quux`]: 'quux#456'
                    }
                }
            );
            checkClasses();
        });

        it('should take a class mapping from the context property and from the static field', () => {
            FooBar.styles = {
                [`foo${ELEMENT_SEPARATOR}bar`]: 'foo#123'
            };
            const WrappedFooBar = element(
                'bar',
                ({baz}) => `baz-${baz}`
            )(FooBar);
            renderer.render(
                <WrappedFooBar baz="quux" />,
                {
                    blockName: 'foo',
                    blockStyles: {
                        [`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}baz-quux`]: 'quux#456'
                    }
                }
            );
            checkClasses();
        });
    });
});
