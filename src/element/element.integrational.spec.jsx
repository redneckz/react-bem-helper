import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import {Config} from '../config';
import {block, plainBlock} from '../block';
import {element} from './element';

const {ELEMENT_SEPARATOR} = Config;

describe('BEM element decorator', () => {
    let renderer;
    let Bar;
    beforeEach(() => {
        renderer = new ReactShallowRenderer();
        Bar = () => <div />;
    });

    it('should use block name from static context provided by BEM block', () => {
        const Foo = block('foo')(() => <div />);
        const WrappedBar = Foo.element('bar')(Bar);
        renderer.render(<WrappedBar />, {blockName: 'quux'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(wrappedFooBar.props.className).toEqual(`foo${ELEMENT_SEPARATOR}bar`);
    });

    it('should use block name from static context provided by BEM plain block', () => {
        const Foo = plainBlock('foo')(() => <div />);
        const WrappedBar = Foo.element('bar')(Bar);
        renderer.render(<WrappedBar />, {blockName: 'quux'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(wrappedFooBar.props.className).toEqual(`foo${ELEMENT_SEPARATOR}bar`);
    });

    describe('applied to some BEM block (BEM mixin)', () => {
        it('should NOT fail with assertion error', () => {
            const OtherFoo = block('other-foo')(() => <div />);
            expect(() => element('bar')(OtherFoo)).not.toThrow();
        });

        it('(defined as plain block should NOT fail with assertion error', () => {
            const OtherFoo = plainBlock('other-foo')(() => <div />);
            expect(() => element('bar')(OtherFoo)).not.toThrow();
        });
    });
});
