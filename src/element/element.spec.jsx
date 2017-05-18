import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import isString from 'lodash/isString';
import {Config} from '../config';
import {element} from './element';

Config.ASSERTION_ENABLED = true;
const {ELEMENT_SEPARATOR, MODIFIER_SEPARATOR} = Config;

jest.mock('../modifier', () => ({
    chooseModifierComponent(Components = []) {
        return Components[0];
    },
    getDefaultComponent(Components = []) {
        return Components[0];
    },
    normalizeModifiers() {
        return {xyzzy: true, plugh: true};
    }
}));

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

    it('should inject [className] property containing element full name', () => {
        const WrappedBar = element('bar')(Bar);
        renderer.render(<WrappedBar />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(isString(wrappedFooBar.props.className)).toBeTruthy();
        expect(wrappedFooBar.props.className).toEqual(`foo${ELEMENT_SEPARATOR}bar`);
    });

    it(`should mixin provided [className] property (passed to decorator)
        into resulting [className] property (injected to wrapped/underlying component)`, () => {
        const WrappedBar = element('bar')(Bar);
        renderer.render(<WrappedBar className="quux" />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(isString(wrappedFooBar.props.className)).toBeTruthy();
        const fooBarClasses = wrappedFooBar.props.className.split(' ');
        expect(fooBarClasses).toHaveLength(2);
        expect(fooBarClasses).toContain(`foo${ELEMENT_SEPARATOR}bar`);
        expect(fooBarClasses).toContain('quux');
    });

    it('should transduce properties to modifiers and mixin corresponding classes into [className]', () => {
        const WrappedBar = element(
            'bar',
            ({baz}) => `baz-${baz}` // transducer
        )(Bar);
        renderer.render(<WrappedBar baz="quux" />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(isString(wrappedFooBar.props.className)).toBeTruthy();
        const fooBarClasses = wrappedFooBar.props.className.split(' ');
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
        expect(isString(wrappedFooBar.props.className)).toBeTruthy();
        const fooBarClasses = wrappedFooBar.props.className.split(' ');
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

    describe('which wraps a component with modular css', () => {
        function checkClasses() {
            const wrappedFooBar = renderer.getRenderOutput();
            expect(isString(wrappedFooBar.props.className)).toBeTruthy();
            const fooBarClasses = wrappedFooBar.props.className.split(' ');
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

        it('should take a class mapping from decorator third arg [options]', () => {
            const styles = {
                [`foo${ELEMENT_SEPARATOR}bar`]: 'foo#123',
                [`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}baz-quux`]: 'quux#456'
            };
            const WrappedBar = element(
                'bar',
                ({baz}) => `baz-${baz}`,
                {styles} // options
            )(Bar);
            renderer.render(<WrappedBar baz="quux" />, {blockName: 'foo'});
            checkClasses();
        });

        it('should take a class mapping from decorator second arg [options] (overloaded version)', () => {
            const styles = {
                [`foo${ELEMENT_SEPARATOR}bar`]: 'foo#123'
            };
            const WrappedBar = element(
                'bar',
                {styles} // options
            )(Bar);
            renderer.render(<WrappedBar />, {blockName: 'foo'});
            const wrappedFooBar = renderer.getRenderOutput();
            expect(wrappedFooBar.props.className).toEqual('foo#123');
        });
    });

    it('should decorate components defined as tag name', () => {
        const WrappedBar = element('bar')('div');
        renderer.render(<WrappedBar />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(wrappedFooBar.type).toEqual('div');
        expect(wrappedFooBar.props.className).toEqual(`foo${ELEMENT_SEPARATOR}bar`);
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
});
