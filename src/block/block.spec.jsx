// @flow
import * as React from 'react';
import { mount } from 'enzyme';
import { BEMConfig } from '../bem-config';
import { block } from './block';
import type { CSSModule, Component } from '../bem-helper-types';
import type { BlockContext } from '../create-block-context';

const { MODIFIER_SEPARATOR } = BEMConfig;

describe('BEM block decorator', () => {
    type Props = {|
        className?: string,
        bar?: string,
        baz?: boolean,
    |};

    let Foo: Component<Props>;

    beforeEach(() => {
      Foo = () => <div />;
    });

    it('should inject [className] property containing block name', () => {
      const WrappedFoo = block(ctx())()(Foo);
      const wrappedFoo = mount(<WrappedFoo />);
      expect(wrappedFoo.find(Foo).prop('className')).toBe('foo');
    });

    it('should pass through all props except [className] and [data-modifiers]', () => {
      const WrappedFoo = block(ctx())()(Foo);
      const wrappedFoo = mount(<WrappedFoo bar="quux" />);
      expect(wrappedFoo.find(Foo).prop('bar')).toBe('quux');
    });

    it('should mixin provided [className] into resulting [className]', () => {
      const WrappedFoo = block(ctx())()(Foo);
      const wrappedFoo = mount(<WrappedFoo className="bar" />);
      expect(wrappedFoo.find(Foo).prop('className')).toBe('foo bar');
    });

    it('should map properties to modifiers and mixin corresponding classes to [className]', () => {
      const WrappedFoo = block(ctx())(
        ({ bar }) => bar, // properties to modifiers
      )(Foo);
      const wrappedFoo = mount(<WrappedFoo bar="quux" />);
      expect(wrappedFoo.find(Foo).prop('className')).toBe(`foo foo${MODIFIER_SEPARATOR}quux`);
    });

    it('should support "classnames" compatible structures as modifiers', () => {
      const WrappedFoo = block(ctx())(
        ({ bar, baz }) => [bar, { baz }], // properties to modifiers
      )(Foo);
      const wrappedFoo = mount(<WrappedFoo bar="quux" baz />);
      expect(wrappedFoo.find(Foo).prop('className')).toBe(
        `foo foo${MODIFIER_SEPARATOR}quux foo${MODIFIER_SEPARATOR}baz`,
      );
    });

    it('should map properties to modifiers and inject [data-modifiers] property with active modifiers', () => {
      const WrappedFoo = block(ctx())(
        ({ bar, baz }) => [bar, { baz }], // properties to modifiers
      )(Foo);
      const wrappedFoo = mount(<WrappedFoo bar="quux" baz />);
      expect(wrappedFoo.find(Foo).prop('data-modifiers')).toBe('quux baz');
    });

    describe('which wraps component with modular CSS', () => {
      const styles = {
        foo: 'foo#123',
        [`foo${MODIFIER_SEPARATOR}quux`]: 'quux#456',
      };

      it('should use class names mapping from [options] which is passed as third arg', () => {
        const WrappedFoo = block(ctx(styles))(({ bar }) => bar)(Foo);
        const wrappedFoo = mount(<WrappedFoo bar="quux" />);
        expect(wrappedFoo.find(Foo).prop('className')).toBe('foo#123 quux#456');
      });

      it('should use class names mapping from [options] which is passed as second arg', () => {
        const WrappedFoo = block(ctx(styles))()(Foo);
        const wrappedFoo = mount(<WrappedFoo />);
        expect(wrappedFoo.find(Foo).prop('className')).toBe('foo#123');
      });
    });

    it('should support DOM components decoration', () => {
      const WrappedFoo = block(ctx())()('div');
      const wrappedFoo = mount(<WrappedFoo />);
      const div = wrappedFoo.find('div');
      expect(div.length).toBe(1);
      expect(div.prop('className')).toBe('foo');
    });

    it('should declare [displayName] containing block name', () => {
      const WrappedFoo = block(ctx())()(Foo);
      expect(WrappedFoo.displayName).toBe('block(foo)');
    });
});

function ctx(styles?: CSSModule | void): BlockContext {
  return {
    name: 'foo',
    styles,
    modifiersContext: {
      Provider: ({ children }: any) => children,
      Consumer: () => null,
    },
  };
}
