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

    it('should inject [displayName] containing block name', () => {
        const WrappedFoo = baseBlock('foo')(Foo);
        expect(WrappedFoo.displayName).toEqual('block(foo)');
    });

    it('should inject [className] property containing block name', () => {
        const WrappedFoo = baseBlock('foo')(Foo);
        renderer.render(<WrappedFoo />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.props.className).toBeDefined();
        expect(wrappedFoo.props.className).toEqual('foo');
    });

    it('should mixin provided [className] property (passed to decorator) ' +
            'into resulting [className] property (injected to wrapped/underlying component)', () => {
        const WrappedFoo = baseBlock('foo')(Foo);
        renderer.render(<WrappedFoo className="quux" />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.props.className).toBeDefined();
        const fooClasses = wrappedFoo.props.className.split(' ');
        expect(fooClasses).toHaveLength(2);
        expect(fooClasses).toContain('foo');
        expect(fooClasses).toContain('quux');
    });

    it('should transduce properties to modifiers and mixin corresponding classes to [className]', () => {
        const WrappedFoo = baseBlock(
            'foo',
            ({bar}) => `bar-${bar}` // transducer
        )(Foo);
        renderer.render(<WrappedFoo bar="quux" />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.props.className).toBeDefined();
        const fooClasses = wrappedFoo.props.className.split(' ');
        expect(fooClasses).toHaveLength(2);
        expect(fooClasses).toContain('foo');
        expect(fooClasses).toContain(`foo${MODIFIER_SEPARATOR}bar-quux`);
    });

    it('should accept "classnames" compatible structures as modifiers', () => {
        const WrappedFoo = baseBlock(
            'foo',
            ({bar, baz}) => ([
                {notBar: !bar},
                `baz-${baz}`
            ])
        )(Foo);
        renderer.render(<WrappedFoo bar={false} baz="quxx" />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.props.className).toBeDefined();
        const fooClasses = wrappedFoo.props.className.split(' ');
        expect(fooClasses).toHaveLength(3);
        expect(fooClasses).toContain('foo');
        expect(fooClasses).toContain(`foo${MODIFIER_SEPARATOR}not-bar`);
        expect(fooClasses).toContain(`foo${MODIFIER_SEPARATOR}baz-quxx`);
    });

    describe('which wraps a component with modular css', () => {
        function checkClasses() {
            const wrappedFoo = renderer.getRenderOutput();
            expect(wrappedFoo.props.className).toBeDefined();
            const fooClasses = wrappedFoo.props.className.split(' ');
            expect(fooClasses).toHaveLength(2);
            expect(fooClasses).toContain('foo#123');
            expect(fooClasses).toContain('quux#456');
        }

        it('should take a class mapping from decorator third arg [options]', () => {
            const styles = {
                foo: 'foo#123',
                [`foo${MODIFIER_SEPARATOR}bar-quux`]: 'quux#456'
            };
            const WrappedFoo = baseBlock(
                'foo',
                ({bar}) => `bar-${bar}`,
                {styles} // options
            )(Foo);
            renderer.render(<WrappedFoo bar="quux" />);
            checkClasses();
        });
    });

    it('should decorate components defined as tag name', () => {
        const WrappedFoo = baseBlock('foo')('div');
        renderer.render(<WrappedFoo />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.type).toEqual('div');
        expect(wrappedFoo.props.className).toEqual('foo');
    });
});
