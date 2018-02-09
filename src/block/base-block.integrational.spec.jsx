import React from 'react';
import {element} from '../element';
import {baseBlock} from './base-block';

jest.mock('../element', () => ({
    element: jest.fn()
}));

describe('BEM base block decorator', () => {
    let Foo;
    beforeEach(() => {
        element.mockReset();
        Foo = () => <div />;
    });

    it('should provide BEM element decorator bound to block`s static context', () => {
        const blockName = 'foo';
        const styles = {foo: 'foo#123'};
        const WrappedFoo = baseBlock(blockName, {styles})(Foo);
        const blockStaticContext = {blockName, blockStyles: styles};

        expect(typeof WrappedFoo.element).toBe('function');
        WrappedFoo.element();
        expect(element.mock.instances.length).toBe(1);
        expect(element.mock.instances[0]).toEqual(blockStaticContext);
    });
});
