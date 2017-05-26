import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import isString from 'lodash/isString';
import {Config} from '../config';
import {plainBlock} from './plain-block';

Config.ASSERTION_ENABLED = true;
const {MODIFIER_SEPARATOR} = Config;

describe('BEM plain block decorator', () => {
    let renderer;
    let Foo;
    beforeEach(() => {
        renderer = new ReactShallowRenderer();
        Foo = () => <div />;
    });

    it('should have [displayName] containing block name', () => {
        const WrappedFoo = plainBlock('foo')(Foo);
        expect(WrappedFoo.displayName).toEqual('block(foo)');
    });

    it('should inject [className] property containing block name', () => {
        const WrappedFoo = plainBlock('foo')(Foo);
        renderer.render(<WrappedFoo />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(isString(wrappedFoo.props.className)).toBeTruthy();
        expect(wrappedFoo.props.className).toEqual('foo');
    });

    it(`should mixin provided [className] property (passed to decorator)
        into resulting [className] property (injected to wrapped/underlying component)`, () => {
        const WrappedFoo = plainBlock('foo')(Foo);
        renderer.render(<WrappedFoo className="quux" />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(isString(wrappedFoo.props.className)).toBeTruthy();
        const fooClasses = wrappedFoo.props.className.split(' ');
        expect(fooClasses).toHaveLength(2);
        expect(fooClasses).toContain('foo');
        expect(fooClasses).toContain('quux');
    });

    it('should transduce properties to modifiers and mixin corresponding classes to [className]', () => {
        const WrappedFoo = plainBlock(
            'foo',
            ({bar}) => `bar-${bar}` // transducer
        )(Foo);
        renderer.render(<WrappedFoo bar="quux" />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(isString(wrappedFoo.props.className)).toBeTruthy();
        const fooClasses = wrappedFoo.props.className.split(' ');
        expect(fooClasses).toHaveLength(2);
        expect(fooClasses).toContain('foo');
        expect(fooClasses).toContain(`foo${MODIFIER_SEPARATOR}bar-quux`);
    });

    it('should accept "classnames" compatible structures as modifiers', () => {
        const WrappedFoo = plainBlock(
            'foo',
            ({bar, baz}) => ([
                {notBar: !bar},
                `baz-${baz}`
            ])
        )(Foo);
        renderer.render(<WrappedFoo bar={false} baz="quxx" />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(isString(wrappedFoo.props.className)).toBeTruthy();
        const fooClasses = wrappedFoo.props.className.split(' ');
        expect(fooClasses).toHaveLength(3);
        expect(fooClasses).toContain('foo');
        expect(fooClasses).toContain(`foo${MODIFIER_SEPARATOR}not-bar`);
        expect(fooClasses).toContain(`foo${MODIFIER_SEPARATOR}baz-quxx`);
    });

    describe('which wraps a component with modular css', () => {
        function checkClasses() {
            const wrappedFoo = renderer.getRenderOutput();
            expect(isString(wrappedFoo.props.className)).toBeTruthy();
            const fooClasses = wrappedFoo.props.className.split(' ');
            expect(fooClasses).toHaveLength(2);
            expect(fooClasses).toContain('foo#123');
            expect(fooClasses).toContain('quux#456');
        }

        it('should take a class mapping from the static field [styles]', () => {
            Foo.styles = {
                foo: 'foo#123',
                [`foo${MODIFIER_SEPARATOR}bar-quux`]: 'quux#456'
            };
            const WrappedFoo = plainBlock(
                'foo',
                ({bar}) => `bar-${bar}`
            )(Foo);
            renderer.render(<WrappedFoo bar="quux" />);
            checkClasses();
        });

        it('should take a class mapping from decorator third arg [options]', () => {
            const styles = {
                foo: 'foo#123',
                [`foo${MODIFIER_SEPARATOR}bar-quux`]: 'quux#456'
            };
            const WrappedFoo = plainBlock(
                'foo',
                ({bar}) => `bar-${bar}`,
                {styles} // options
            )(Foo);
            renderer.render(<WrappedFoo bar="quux" />);
            checkClasses();
        });

        it('should take a class mapping from decorator second arg [options] (overloaded version)', () => {
            const styles = {
                foo: 'foo#123'
            };
            const WrappedFoo = plainBlock(
                'foo',
                {styles} // options
            )(Foo);
            renderer.render(<WrappedFoo />);
            const wrappedFoo = renderer.getRenderOutput();
            expect(wrappedFoo.props.className).toEqual('foo#123');
        });
    });

    it('should decorate components defined as tag name', () => {
        const WrappedFoo = plainBlock('foo')('div');
        renderer.render(<WrappedFoo />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.type).toEqual('div');
        expect(wrappedFoo.props.className).toEqual('foo');
    });

    it('should fail in case of invalid block name (not kebab-case)', () => {
        expect(() => plainBlock('FOO')).toThrow();
    });

    it('should fail in case of inconsistent component name', () => {
        expect(() => plainBlock('bar')(Foo)).toThrow();
    });
});
