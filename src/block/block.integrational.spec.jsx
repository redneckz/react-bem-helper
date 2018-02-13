import React from 'react';
import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import {block} from './block';
import {element, transparent} from '../element';
import {Config} from '../config';

const {ELEMENT_SEPARATOR, MODIFIER_SEPARATOR} = Config;

const {mount} = Enzyme;
Enzyme.configure({adapter: new EnzymeAdapter()});


describe('BEM block decorator', () => {
    let Foo;
    beforeEach(() => {
        Foo = props => <div {...props} />;
    });

    it('should provide BEM element decorator bound to block', () => {
        const WrappedFoo = block('foo')(Foo);
        expect(Foo.element).toBeInstanceOf(Function);
        expect(WrappedFoo.element).toBeInstanceOf(Function);
    });

    describe('composed with BEM element', () => {
        it('should provide block name, block modifiers and block styles by means of context', () => {
            const WrappedFoo = block('foo', ({quux}) => ({quux}))(Foo);
            const Bar = props => <div {...props} />;
            const WrappedBar = element('bar', transparent())(Bar);
            const wrappedFoo = mount(<WrappedFoo quux><WrappedBar /></WrappedFoo>);
            const wrappedBar = wrappedFoo.find(Bar);
            expect(wrappedBar.props().className).toBe(
                `foo${ELEMENT_SEPARATOR}bar foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}quux`
            );
        });
    });
});
