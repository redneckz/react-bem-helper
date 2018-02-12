import React from 'react';
import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import {baseBlock} from './base-block';
import {blockContextTypes} from './block-context-types';
import {block} from './block';

const {mount} = Enzyme;
Enzyme.configure({adapter: new EnzymeAdapter()});

jest.mock('./base-block', () => ({
    baseBlock: jest.fn()
}));

describe('BEM block decorator', () => {
    beforeEach(() => {
        baseBlock.mockReset();
        baseBlock.mockImplementation(() => BlockComponent => BlockComponent);
    });

    it('should transparently delegate call to baseBlock', () => {
        const mapPropsToModifiers = () => {};
        const options = {styles: {}};
        block('foo', mapPropsToModifiers, options);
        expect(baseBlock).toBeCalledWith('foo', mapPropsToModifiers, options);
    });

    it('should provide block name, block modifiers and block styles by means of context', () => {
        const Foo = jest.fn(() => null);
        Foo.contextTypes = blockContextTypes;

        const blockName = 'foo';
        const blockModifiers = 'quux';
        const blockStyles = {foo: 'foo#123'};
        const WrappedFoo = block(blockName, {styles: blockStyles})(Foo);
        mount(<WrappedFoo data-modifiers={blockModifiers} />);

        expect(Foo.mock.calls.length).toBe(1);
        const [[, context]] = Foo.mock.calls;
        expect(context).toEqual({blockName, blockModifiers, blockStyles});
    });

    it('should take options as second arg (overloaded version)', () => {
        const options = {styles: {}};
        block('foo', options);
        expect(baseBlock).toBeCalledWith('foo', undefined, options);
    });

    it('should declare [displayName] containing block name', () => {
        const Foo = () => <div />;
        const WrappedFoo = block('foo')(Foo);
        expect(WrappedFoo.displayName).toBe('block-with-context(foo)');
    });
});
