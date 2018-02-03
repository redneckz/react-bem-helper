import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import {modifier} from './modifier';

describe('BEM modifier decorator', () => {
    let renderer;
    let Foo;
    let FooQuux;
    beforeEach(() => {
        renderer = new ReactShallowRenderer();
        Foo = () => <div />; // Decorated component
        FooQuux = () => <span />; // Modified component
    });

    it('should "choose" decorated component if predicate evaluates to false', () => {
        const falsyPredicate = () => false;
        const WrappedFoo = modifier(falsyPredicate, FooQuux)(Foo);
        renderer.render(<WrappedFoo />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.type).toBe(Foo);
    });

    it('should "choose" modified component if predicate evaluates to true', () => {
        const truthyPredicate = () => true;
        const WrappedFoo = modifier(truthyPredicate, FooQuux)(Foo);
        renderer.render(<WrappedFoo />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(wrappedFoo.type).toBe(FooQuux);
    });

    it('should pass active modifiers to predicate', () => {
        const predicate = jest.fn();
        const WrappedFoo = modifier(predicate, FooQuux)(Foo);
        renderer.render(<WrappedFoo modifiers="quux plugh" />);
        expect(predicate).toBeCalledWith(['quux', 'plugh']);
    });

    it('should fail if no predicate provided', () => {
        expect(() => modifier()).toThrow(TypeError);
    });

    it('should fail if no modified component provided', () => {
        expect(() => modifier(() => true)(FooQuux)).toThrow(TypeError);
    });
});
