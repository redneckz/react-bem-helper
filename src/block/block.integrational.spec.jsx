// @flow
import React from 'react';
import { mount } from 'enzyme';
import { block } from './block';
import type { BlockContext } from '../create-block-context';

describe('BEM block decorator', () => {
    it('should provide block modifiers by means of context', () => {
        const contextConsumer = jest.fn();
        const context = ctx();
        const { modifiersContext: ModifiersContext } = context;

        const blockModifiers = 'quux';
        const WrappedFoo = block(context)(() => blockModifiers)(() => (
            <ModifiersContext.Consumer>{contextConsumer}</ModifiersContext.Consumer>
        ));
        mount(<WrappedFoo />);

        expect(contextConsumer).toHaveBeenCalledWith(blockModifiers);
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
