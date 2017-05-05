import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import isString from 'lodash/isString';
import {Config} from '../config';
import {element} from './element';
import {modifier} from '../modifier';

Config.ASSERTION_ENABLED = true;
const {ELEMENT_SEPARATOR, MODIFIER_SEPARATOR} = Config;

describe('BEM element decorator', () => {
    let renderer;
    let Bar;
    beforeEach(() => {
        renderer = new ReactShallowRenderer();
        Bar = () => <div />;
    });

    it('should have [displayName] containing element name', () => {
        const WrappedBar = element('bar')(Bar);
        expect(WrappedBar.displayName).toEqual('element(bar)');
    });

    it('should inject [elementClassName] property with valid BEM name', () => {
        const WrappedBar = element('bar')(Bar);
        renderer.render(<WrappedBar />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(isString(wrappedFooBar.props.elementClassName)).toBeTruthy();
        expect(wrappedFooBar.props.elementClassName).toEqual(`foo${ELEMENT_SEPARATOR}bar`);
    });

    it('should mixin provided [className] property into [elementClassName] property', () => {
        const WrappedBar = element('bar')(Bar);
        renderer.render(<WrappedBar className="quux" />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(isString(wrappedFooBar.props.elementClassName)).toBeTruthy();
        const fooBarClasses = wrappedFooBar.props.elementClassName.split(' ');
        expect(fooBarClasses).toHaveLength(2);
        expect(fooBarClasses).toContain(`foo${ELEMENT_SEPARATOR}bar`);
        expect(fooBarClasses).toContain('quux');
    });

    it('should transduce properties to modifiers and mixin corresponding classes into [elementClassName]', () => {
        const WrappedBar = element(
            'bar',
            ({baz}) => `baz-${baz}`
        )(Bar);
        renderer.render(<WrappedBar baz="quux" />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(isString(wrappedFooBar.props.elementClassName)).toBeTruthy();
        const fooBarClasses = wrappedFooBar.props.elementClassName.split(' ');
        expect(fooBarClasses).toHaveLength(2);
        expect(fooBarClasses).toContain(`foo${ELEMENT_SEPARATOR}bar`);
        expect(fooBarClasses).toContain(`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}baz-quux`);
    });

    it('should accept "classnames" compatible structures as modifier', () => {
        const WrappedBar = element(
            'bar',
            ({baz}) => ({notBaz: !baz})
        )(Bar);
        renderer.render(<WrappedBar baz={false} />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(isString(wrappedFooBar.props.elementClassName)).toBeTruthy();
        const fooBarClasses = wrappedFooBar.props.elementClassName.split(' ');
        expect(fooBarClasses).toHaveLength(2);
        expect(fooBarClasses).toContain(`foo${ELEMENT_SEPARATOR}bar`);
        expect(fooBarClasses).toContain(`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}not-baz`);
    });

    it('should pass block modifiers to [mapPropsToModifiers] transducer as second argument', () => {
        const mapPropsToModifiers = jest.fn().mockReturnValue('quux');
        const WrappedBar = element(
            'bar',
            mapPropsToModifiers
        )(Bar);
        renderer.render(
            <WrappedBar />,
            {
                blockName: 'foo',
                blockModifiers: 'xyzzy plugh'
            }
        );
        expect(mapPropsToModifiers).toBeCalledWith(
            {},
            {
                xyzzy: true,
                plugh: true
            }
        );
    });

    it('should fail in case of empty context', () => {
        const WrappedBar = element('bar')(Bar);
        expect(() => renderer.render(<WrappedBar />)).toThrow(/^\[BEM\].+/);
    });

    it('should fail in case of invalid element name (not kebab-case)', () => {
        expect(() => element('BAR')).toThrow(/^\[BEM\].+/);
    });

    it('should fail in case of inconsistent component name', () => {
        expect(() => element('baz')(Bar)).toThrow();
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
            Bar.styles = {
                [`foo${ELEMENT_SEPARATOR}bar`]: 'foo#123',
                [`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}baz-quux`]: 'quux#456'
            };
            const WrappedBar = element(
                'bar',
                ({baz}) => `baz-${baz}`
            )(Bar);
            renderer.render(<WrappedBar baz="quux" />, {blockName: 'foo'});
            checkClasses();
        });

        it('should take a class mapping from the context property [blockStyles]', () => {
            const WrappedBar = element(
                'bar',
                ({baz}) => `baz-${baz}`
            )(Bar);
            renderer.render(
                <WrappedBar baz="quux" />,
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
    });

    // Integration tests
    describe('with separate modifier components', () => {
        let BarXyzzy;
        let BarPlugh;
        beforeEach(() => {
            renderer = new ReactShallowRenderer();
            BarXyzzy = () => <div />;
            BarPlugh = () => <div />;
        });

        it('should choose component according to modifier', () => {
            const WrappedBar = element(
                'bar',
                ({xyzzy, plugh}) => [{xyzzy}, `plugh-${plugh}`]
            )(
                Bar,
                modifier('xyzzy')(BarXyzzy),
                modifier(/^plugh-\w\w$/)(BarPlugh)
            );
            renderer.render(<WrappedBar />, {blockName: 'foo'});
            let wrappedBar = renderer.getRenderOutput();
            expect(wrappedBar.type).toBe(Bar);
            renderer.render(<WrappedBar xyzzy />, {blockName: 'foo'});
            wrappedBar = renderer.getRenderOutput();
            expect(wrappedBar.type).toBe(BarXyzzy);
            renderer.render(<WrappedBar plugh="xs" />, {blockName: 'foo'});
            wrappedBar = renderer.getRenderOutput();
            expect(wrappedBar.type).toBe(BarPlugh);
        });
    });
});
