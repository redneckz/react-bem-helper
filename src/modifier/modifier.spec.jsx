// @flow
import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactShallowRenderer from 'react-test-renderer/shallow';
import type { Component } from '../bem-helper-types';
import { modifier } from './modifier';

describe('BEM modifier decorator', () => {
  let Foo: Component<{ 'data-modifiers'?: string }>;
  let FooQuux: Component<{ 'data-modifiers'?: string }>;
  let renderer;

  beforeEach(() => {
    Foo = () => <div />; // Decorated component
    FooQuux = () => <span />; // Modified component
    renderer = new ReactShallowRenderer();
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
    renderer.render(<WrappedFoo data-modifiers="quux plugh" />);
    expect(predicate).toBeCalledWith(['quux', 'plugh']);
  });

  it('should fail if no predicate provided', () => {
    expect(() => (modifier: any)()).toThrow(TypeError);
  });

  it('should fail if no modified component provided', () => {
    expect(() => (modifier: any)(() => true)(FooQuux)).toThrow(TypeError);
  });
});
