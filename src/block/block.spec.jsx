import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import isString from 'lodash/isString';
import {Config} from '../config';
import {block} from './block';

Config.ASSERTION_ENABLED = true;
const {MODIFIER_SEPARATOR} = Config;

jest.mock('../modifier', () => ({
    chooseModifierComponent(Components = []) {
        return Components[0];
    },
    getDefaultComponent(Components = []) {
        return Components[0];
    }
}));

describe('BEM block decorator', () => {
    let renderer;
    let Foo;
    beforeEach(() => {
        renderer = new ReactShallowRenderer();
        Foo = () => <div />;
    });

    it('should have [displayName] containing block name', () => {
        const WrappedFoo = block('foo')(Foo);
        expect(WrappedFoo.displayName).toEqual('block(foo)');
    });

    it('should inject [blockClassName] property', () => {
        const WrappedFoo = block('foo')(Foo);
        renderer.render(<WrappedFoo />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(isString(wrappedFoo.props.blockClassName)).toBeTruthy();
        expect(wrappedFoo.props.blockClassName).toEqual('foo');
    });

    it('should mixin provided [className] property into [blockClassName] property', () => {
        const WrappedFoo = block('foo')(Foo);
        renderer.render(<WrappedFoo className="quux" />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(isString(wrappedFoo.props.blockClassName)).toBeTruthy();
        const fooClasses = wrappedFoo.props.blockClassName.split(' ');
        expect(fooClasses).toHaveLength(2);
        expect(fooClasses).toContain('foo');
        expect(fooClasses).toContain('quux');
    });

    it('should map properties to modifiers and mixin corresponding classes to [blockClassName]', () => {
        const WrappedFoo = block(
            'foo',
            ({bar}) => `bar-${bar}`
        )(Foo);
        renderer.render(<WrappedFoo bar="quux" />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(isString(wrappedFoo.props.blockClassName)).toBeTruthy();
        const fooClasses = wrappedFoo.props.blockClassName.split(' ');
        expect(fooClasses).toHaveLength(2);
        expect(fooClasses).toContain('foo');
        expect(fooClasses).toContain(`foo${MODIFIER_SEPARATOR}bar-quux`);
    });

    it('should accept "classnames" compatible structures as modifier', () => {
        const WrappedFoo = block(
            'foo',
            ({bar, baz}) => ([
                {notBar: !bar},
                `baz-${baz}`
            ])
        )(Foo);
        renderer.render(<WrappedFoo bar={false} baz="quxx" />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(isString(wrappedFoo.props.blockClassName)).toBeTruthy();
        const fooClasses = wrappedFoo.props.blockClassName.split(' ');
        expect(fooClasses).toHaveLength(3);
        expect(fooClasses).toContain('foo');
        expect(fooClasses).toContain(`foo${MODIFIER_SEPARATOR}not-bar`);
        expect(fooClasses).toContain(`foo${MODIFIER_SEPARATOR}baz-quxx`);
    });

    it('should support modular CSS (styles map should be defined as static field [styles])', () => {
        Foo.styles = {
            foo: 'foo#123',
            [`foo${MODIFIER_SEPARATOR}bar-quux`]: 'quux#456'
        };
        const WrappedFoo = block(
            'foo',
            ({bar}) => `bar-${bar}`
        )(Foo);
        renderer.render(<WrappedFoo bar="quux" />);
        const wrappedFoo = renderer.getRenderOutput();
        expect(isString(wrappedFoo.props.blockClassName)).toBeTruthy();
        const fooClasses = wrappedFoo.props.blockClassName.split(' ');
        expect(fooClasses).toHaveLength(2);
        expect(fooClasses).toContain('foo#123');
        expect(fooClasses).toContain('quux#456');
    });

    it('should fail in case of invalid block name (not kebab-case)', () => {
        expect(() => block('FOO')).toThrow();
    });

    it('should fail in case of inconsistent component name', () => {
        expect(() => block('bar')(Foo)).toThrow();
    });
});
