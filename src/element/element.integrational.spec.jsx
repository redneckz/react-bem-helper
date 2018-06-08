// @flow
import React from 'react';
import { mount } from 'enzyme';
import { BEMConfig } from '../bem-config';
import { block } from '../block';
import { element, transparent } from './element';
import type { Component } from '../bem-helper-types';
import type { BlockContext } from '../create-block-context';

const { ELEMENT_SEPARATOR, MODIFIER_SEPARATOR } = BEMConfig;

describe('BEM element decorator', () => {
    let Foo: Component<{ className?: string, quux?: boolean, children?: React$Node }>;
    let Bar: Component<{ className?: string }>;

    beforeEach(() => {
        Foo = ({ className, children }) => <div className={className}>{children}</div>;
        Bar = ({ className }) => <div className={className} />;
    });

    it('should apply block modifiers to "transparent" element', () => {
        const context = ctx();
        const WrappedFoo = block(context)(({ quux }) => ({ quux }))(Foo);
        const WrappedBar = element(context)('bar', transparent())(Bar);
        const wrappedFooBar = mount(
            <WrappedFoo quux>
                <WrappedBar />
            </WrappedFoo>,
        );
        expect(wrappedFooBar.find(Bar).prop('className')).toBe(
            `foo${ELEMENT_SEPARATOR}bar foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}quux`,
        );
    });

    describe('applied to some BEM block (BEM mixin)', () => {
        it('should NOT fail with assertion error', () => {
            const OtherFoo = block(ctx())()(Foo);
            expect(() => {
                const WrappedBar = element(ctx())('bar')(OtherFoo);
                mount(
                    <OtherFoo>
                        <WrappedBar />
                    </OtherFoo>,
                );
            }).not.toThrow();
        });
    });
});

function ctx(): BlockContext {
    let mods;
    return {
        name: 'foo',
        styles: undefined,
        modifiersContext: {
            Provider: ({ value, children }: any) => {
                mods = value;
                return children;
            },
            Consumer: ({ children }: any) => children(mods) || null,
        },
    };
}
