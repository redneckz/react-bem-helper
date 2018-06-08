// @flow
import React from 'react';
import { mount } from 'enzyme';
import { BEMConfig } from '../bem-config';
import { element } from './element';
import type { Component } from '../bem-helper-types';
import type { BlockContext } from '../create-block-context';

const { ELEMENT_SEPARATOR, MODIFIER_SEPARATOR } = BEMConfig;

describe('BEM element decorator', () => {
    type Props = {|
        className?: string,
        baz?: string,
        quux?: boolean,
        plugh?: boolean,
    |};

    let Bar: Component<Props>;

    beforeEach(() => {
        Bar = () => <div />;
    });

    it('should inject [className] property containing element name', () => {
        const WrappedBar = element(ctx())('bar')(Bar);
        const wrappedFooBar = mount(<WrappedBar />);
        expect(wrappedFooBar.find(Bar).prop('className')).toBe(`foo${ELEMENT_SEPARATOR}bar`);
    });

    it('should pass through all props except [className] and [data-modifiers]', () => {
        const WrappedBar = element(ctx())('bar')(Bar);
        const wrappedFooBar = mount(<WrappedBar quux />);
        expect(wrappedFooBar.find(Bar).prop('quux')).toBe(true);
    });

    it('should mixin provided [className] into resulting [className]', () => {
        const WrappedBar = element(ctx())('bar')(Bar);
        const wrappedFooBar = mount(<WrappedBar className="quux" />);
        expect(wrappedFooBar.find(Bar).prop('className')).toBe(`foo${ELEMENT_SEPARATOR}bar quux`);
    });

    it('should map properties to modifiers and mixin corresponding classes to [className]', () => {
        const WrappedBar = element(ctx())(
            'bar',
            ({ baz }) => baz, // properties to modifiers
        )(Bar);
        const wrappedFooBar = mount(<WrappedBar baz="quux" />);
        const baseName = `foo${ELEMENT_SEPARATOR}bar`;
        expect(wrappedFooBar.find(Bar).prop('className')).toBe(
            `${baseName} ${baseName}${MODIFIER_SEPARATOR}quux`,
        );
    });

    it('should support "classnames" compatible structures as modifier', () => {
        const WrappedBar = element(ctx())(
            'bar',
            ({ baz, plugh }) => [baz, { plugh }], // properties to modifiers
        )(Bar);
        const wrappedFooBar = mount(<WrappedBar baz="quux" plugh />);
        const baseName = `foo${ELEMENT_SEPARATOR}bar`;
        expect(wrappedFooBar.find(Bar).prop('className')).toBe(
            `${baseName} ${baseName}${MODIFIER_SEPARATOR}quux ${baseName}${MODIFIER_SEPARATOR}plugh`,
        );
    });

    it('should map properties to modifiers and inject [data-modifiers] property with active modifiers', () => {
        const WrappedBar = element(ctx())(
            'bar',
            ({ baz, plugh }) => [baz, { plugh }], // properties to modifiers
        )(Bar);
        const wrappedFooBar = mount(<WrappedBar baz="quux" plugh />);
        expect(wrappedFooBar.find(Bar).prop('data-modifiers')).toBe('quux plugh');
    });

    it('should pass block modifiers to [mapPropsToModifiers] function as second argument', () => {
        // See "blockModifiers" defined in mock above
        const mapPropsToModifiers = jest.fn().mockReturnValue('quux');
        const WrappedBar = element(ctx())('bar', mapPropsToModifiers)(Bar);
        mount(<WrappedBar />);
        expect(mapPropsToModifiers).toBeCalledWith({}, ['xyzzy', 'plugh']);
    });

    describe('which wraps a component with modular CSS', () => {
        it('should use class names mapping from from component`s context', () => {
            // See "blockStyles" defined in mock above
            const WrappedZxc = element(ctx())('zxc', ({ baz }) => baz)(Bar);
            const wrappedFooZxc = mount(<WrappedZxc baz="quux" />);
            expect(wrappedFooZxc.find(Bar).prop('className')).toBe('zxc#123 quux#456');
        });

        const styles = {
            [`foo${ELEMENT_SEPARATOR}bar`]: 'bar#777',
            [`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}quux`]: 'quux#999',
        };

        it('should use class names mapping from [options] which is passed as third arg', () => {
            const WrappedBar = element(ctx())(
                'bar',
                ({ baz }) => baz,
                { styles }, // options
            )(Bar);
            const wrappedFooBar = mount(<WrappedBar baz="quux" />);
            expect(wrappedFooBar.find(Bar).prop('className')).toBe('bar#777 quux#999');
        });

        it('should use class names mapping from [options] which is passed as second arg', () => {
            const WrappedBar = element(ctx())(
                'bar',
                undefined,
                { styles }, // options
            )(Bar);
            const wrappedFooBar = mount(<WrappedBar />);
            expect(wrappedFooBar.find(Bar).prop('className')).toBe('bar#777');
        });
    });

    it('should support DOM components decoration', () => {
        const WrappedBar = element(ctx())('bar')('div');
        const wrappedFooBar = mount(<WrappedBar />);
        const div = wrappedFooBar.find('div');
        expect(div.length).toBe(1);
        expect(div.prop('className')).toBe(`foo${ELEMENT_SEPARATOR}bar`);
    });

    it('should declare [displayName] containing element name', () => {
        const WrappedBar = element(ctx())('bar')(Bar);
        expect(WrappedBar.displayName).toBe('element(bar)');
    });
});

function ctx(): BlockContext {
    const blockModifiers = 'xyzzy plugh';
    return {
        name: 'foo',
        styles: {
            foo__zxc: 'zxc#123',
            'foo__zxc--quux': 'quux#456',
        },
        modifiersContext: {
            Provider: () => null,
            Consumer: ({ children }: any) => children(blockModifiers) || null,
        },
    };
}
