import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import {Config} from '../config';
import {block} from './block';
import {modifier} from '../modifier';

Config.ASSERTION_ENABLED = true;

describe('BEM block decorator', () => {
    let Foo;
    beforeEach(() => {
        Foo = () => <div />;
    });

    it('should provide "namespaced" BEM element decorator', () => {
        const WrappedFoo = block('foo')(Foo);
        expect(Foo.element).toBeInstanceOf(Function);
        expect(WrappedFoo.element).toBeInstanceOf(Function);
    });

    describe('with separate modifier components', () => {
        let renderer;
        let FooXyzzy;
        let FooPlugh;
        beforeEach(() => {
            renderer = new ReactShallowRenderer();
            FooXyzzy = () => <div />;
            FooPlugh = () => <div />;
        });

        it('should choose component according to modifier', () => {
            const WrappedFoo = block(
                'foo',
                ({xyzzy, plugh}) => [{xyzzy}, `plugh-${plugh}`]
            )(
                Foo,
                modifier('xyzzy')(FooXyzzy),
                modifier(/^plugh-\w\w$/)(FooPlugh)
            );
            renderer.render(<WrappedFoo />);
            let wrappedFoo = renderer.getRenderOutput();
            expect(wrappedFoo.type).toBe(Foo);
            renderer.render(<WrappedFoo xyzzy />);
            wrappedFoo = renderer.getRenderOutput();
            expect(wrappedFoo.type).toBe(FooXyzzy);
            renderer.render(<WrappedFoo plugh="xs" />);
            wrappedFoo = renderer.getRenderOutput();
            expect(wrappedFoo.type).toBe(FooPlugh);
        });
    });
});
