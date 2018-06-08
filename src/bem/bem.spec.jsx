// @flow
import React from 'react';
import { mount } from 'enzyme';
import { BEMConfig } from '../bem-config';
import { BEM } from './bem';
import { div } from '../tag';
import type { CSSModule, Component } from '../bem-helper-types';
import type { BlockContext } from '../create-block-context';

const { ELEMENT_SEPARATOR, MODIFIER_SEPARATOR } = BEMConfig;

jest.mock('../create-block-context', () => {
    let mods;
    return {
        createBlockContext: ({
            name,
            styles,
        }: {
            name: string,
            styles?: CSSModule | void,
        }): BlockContext => ({
            name,
            styles,
            modifiersContext: {
                Provider: ({ value, children }: any) => {
                    mods = value;
                    return children;
                },
                Consumer: ({ children }: any) => children(mods) || null,
            },
        }),
    };
});

describe('BEM factory provider', () => {
    const styles = {
        foo: 'foo#123',
        [`foo${MODIFIER_SEPARATOR}quux`]: 'quux#123',
        [`foo${MODIFIER_SEPARATOR}enum${MODIFIER_SEPARATOR}first`]: 'first#123',
        [`foo${MODIFIER_SEPARATOR}enum${MODIFIER_SEPARATOR}second`]: 'second#123',
        [`foo${ELEMENT_SEPARATOR}bar`]: 'bar#456',
        [`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}plugh`]: 'plugh#456',
    };

    type FooProps = {|
        className?: string,
        quux?: boolean,
        enum?: 'first' | 'second',
    |};

    type BarProps = {|
        className?: string,
        plugh?: boolean,
    |};

    let Foo: Component<FooProps>;
    let Bar: Component<BarProps>;

    beforeEach(() => {
        Foo = () => <div />;
        Bar = () => <div />;
    });

    it('should analize block CSS to findout block srtucture and provide appropriate HOCs', () => {
        const foo = BEM(styles);
        expect(typeof foo).toBe('function'); // BEM block HOC
        expect(typeof foo.bar).toBe('function'); // BEM element HOC
    });

    it('should provide HOC for block', () => {
        const foo = BEM(styles);
        const WrappedFoo = foo(Foo);
        const wrappedFoo = mount(<WrappedFoo />);
        expect(wrappedFoo.find(Foo).prop('className')).toBe('foo#123');
    });

    it('should provide "ready to go" HOC for block with boolean modifiers', () => {
        const foo = BEM(styles);
        const WrappedFoo = foo(Foo);
        const wrappedFoo = mount(<WrappedFoo quux />);
        expect(wrappedFoo.find(Foo).prop('className')).toBe('foo#123 quux#123');
    });

    it('should provide "ready to go" HOC for block with enumerable modifiers', () => {
        const foo = BEM(styles);
        const WrappedFoo = foo(Foo);
        let wrappedFoo = mount(<WrappedFoo enum="first" />);
        expect(wrappedFoo.find(Foo).prop('className')).toBe('foo#123 first#123');
        wrappedFoo = mount(<WrappedFoo enum="second" />);
        expect(wrappedFoo.find(Foo).prop('className')).toBe('foo#123 second#123');
        wrappedFoo = mount(<WrappedFoo quux enum="second" />);
        expect(wrappedFoo.find(Foo).prop('className')).toBe('foo#123 quux#123 second#123');
    });

    it('should provide HOCs for elements', () => {
        const foo = BEM(styles);
        const WrappedBar = foo.bar(Bar);
        const wrappedBar = mount(<WrappedBar />);
        expect(wrappedBar.find(Bar).prop('className')).toBe('bar#456');
    });

    it('should provide "ready to go" HOCs for elements with boolean modifiers', () => {
        const foo = BEM(styles);
        const WrappedBar = foo.bar(Bar);
        const wrappedBar = mount(<WrappedBar plugh />);
        expect(wrappedBar.find(Bar).prop('className')).toBe('bar#456 plugh#456');
    });

    it('should provide HOCs to decorate DOM components', () => {
        const foo = BEM(styles);
        const WrappedBar = foo('div');
        const wrappedBar = mount(<WrappedBar className="qwerty" />);
        expect(wrappedBar.find('div').prop('className')).toBe('foo#123 qwerty');
    });

    it('should provide HOCs to decorate DOM components produced by factory', () => {
        const foo = BEM(styles);
        const WrappedBar = foo(div(({}: { className?: string })));
        const wrappedBar = mount(<WrappedBar className="qwerty" />);
        expect(wrappedBar.find('div').prop('className')).toBe('foo#123 qwerty');
    });
});
