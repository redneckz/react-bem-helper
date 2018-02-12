import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import {Config} from '../config';
import {baseBlock} from './base-block';

const {MODIFIER_SEPARATOR} = Config;

describe('BEM base block decorator', () => {
    let renderer;
    let Foo;
    beforeEach(() => {
        renderer = new ReactShallowRenderer();
        Foo = () => <div />;
    });

    it('should inject [className] property containing block name', () => {
        const WrappedFoo = baseBlock('foo')(Foo);
        renderer.render(<WrappedFoo />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.props.className).toBe('foo');
    });

    it('should pass through all props except [className] and [data-modifiers]', () => {
        const WrappedFoo = baseBlock('foo')(Foo);
        renderer.render(<WrappedFoo bar="quux" />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.props.bar).toBe('quux');
    });

    it('should mixin provided [className] into resulting [className]', () => {
        const WrappedFoo = baseBlock('foo')(Foo);
        renderer.render(<WrappedFoo className="bar" />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.props.className).toBe('foo bar');
    });

    it('should map properties to modifiers and mixin corresponding classes to [className]', () => {
        const WrappedFoo = baseBlock(
            'foo',
            ({bar}) => bar // properties to modifiers
        )(Foo);
        renderer.render(<WrappedFoo bar="quux" />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.props.className).toBe(`foo foo${MODIFIER_SEPARATOR}quux`);
    });

    it('should support "classnames" compatible structures as modifiers', () => {
        const WrappedFoo = baseBlock(
            'foo',
            ({bar, baz}) => [bar, {baz}] // properties to modifiers
        )(Foo);
        renderer.render(<WrappedFoo bar="quux" baz />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.props.className)
            .toBe(`foo foo${MODIFIER_SEPARATOR}quux foo${MODIFIER_SEPARATOR}baz`);
    });

    it('should map properties to modifiers and inject [data-modifiers] property with active modifiers', () => {
        const WrappedFoo = baseBlock(
            'foo',
            ({bar, baz}) => [bar, {baz}] // properties to modifiers
        )(Foo);
        renderer.render(<WrappedFoo bar="quux" baz />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.props['data-modifiers']).toBe('quux baz');
    });

    describe('which wraps component with modular CSS', () => {
        const styles = {
            foo: 'foo#123',
            [`foo${MODIFIER_SEPARATOR}quux`]: 'quux#456'
        };

        it('should use class names mapping from [options] which is passed as third arg', () => {
            const WrappedFoo = baseBlock(
                'foo',
                ({bar}) => bar,
                {styles} // options
            )(Foo);
            renderer.render(<WrappedFoo bar="quux" />);
            const wrappedFoo = renderer.getRenderOutput();
            expect(wrappedFoo.props.className).toBe('foo#123 quux#456');
        });

        it('should use class names mapping from [options] which is passed as second arg', () => {
            const WrappedFoo = baseBlock(
                'foo',
                {styles} // options
            )(Foo);
            renderer.render(<WrappedFoo />);
            const wrappedFoo = renderer.getRenderOutput();
            expect(wrappedFoo.props.className).toBe('foo#123');
        });
    });

    it('should support DOM components decoration', () => {
        const WrappedFoo = baseBlock('foo')('div');
        renderer.render(<WrappedFoo />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.type).toBe('div');
        expect(wrappedFoo.props.className).toBe('foo');
    });

    it('should declare [displayName] containing block name', () => {
        const WrappedFoo = baseBlock('foo')(Foo);
        expect(WrappedFoo.displayName).toBe('block(foo)');
    });
});
