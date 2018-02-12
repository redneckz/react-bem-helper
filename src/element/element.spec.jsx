import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import {Config} from '../config';
import {element} from './element';

const {ELEMENT_SEPARATOR, MODIFIER_SEPARATOR} = Config;

describe('BEM element decorator', () => {
    let renderer;
    let Bar;
    beforeEach(() => {
        renderer = new ReactShallowRenderer();
        Bar = () => <div />;
    });

    it('should inject [className] property containing element name', () => {
        const WrappedBar = element('bar')(Bar);
        renderer.render(<WrappedBar />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(wrappedFooBar.props.className).toBe(`foo${ELEMENT_SEPARATOR}bar`);
    });

    it('should pass through all props except [className] and [data-modifiers]', () => {
        const WrappedBar = element('bar')(Bar);
        renderer.render(<WrappedBar quux />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(wrappedFooBar.props.quux).toBe(true);
    });

    it('should mixin provided [className] into resulting [className]', () => {
        const WrappedBar = element('bar')(Bar);
        renderer.render(<WrappedBar className="quux" />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(wrappedFooBar.props.className).toBe(`foo${ELEMENT_SEPARATOR}bar quux`);
    });

    it('should map properties to modifiers and mixin corresponding classes to [className]', () => {
        const WrappedBar = element(
            'bar',
            ({baz}) => baz // properties to modifiers
        )(Bar);
        renderer.render(<WrappedBar baz="quux" />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        const baseName = `foo${ELEMENT_SEPARATOR}bar`;
        expect(wrappedFooBar.props.className).toBe(
            `${baseName} ${baseName}${MODIFIER_SEPARATOR}quux`
        );
    });

    it('should support "classnames" compatible structures as modifier', () => {
        const WrappedBar = element(
            'bar',
            ({baz, plugh}) => [baz, {plugh}] // properties to modifiers
        )(Bar);
        renderer.render(<WrappedBar baz="quux" plugh />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        const baseName = `foo${ELEMENT_SEPARATOR}bar`;
        expect(wrappedFooBar.props.className).toBe(
            `${baseName} ${baseName}${MODIFIER_SEPARATOR}quux ${baseName}${MODIFIER_SEPARATOR}plugh`
        );
    });

    it('should map properties to modifiers and inject [data-modifiers] property with active modifiers', () => {
        const WrappedBar = element(
            'bar',
            ({baz, plugh}) => [baz, {plugh}] // properties to modifiers
        )(Bar);
        renderer.render(<WrappedBar baz="quux" plugh />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(wrappedFooBar.props['data-modifiers']).toBe('quux plugh');
    });

    it('should pass block modifiers to [mapPropsToModifiers] function as second argument', () => {
        const mapPropsToModifiers = jest.fn().mockReturnValue('quux');
        const WrappedBar = element('bar', mapPropsToModifiers)(Bar);
        renderer.render(<WrappedBar />, {
            blockName: 'foo',
            blockModifiers: 'xyzzy plugh'
        });
        expect(mapPropsToModifiers).toBeCalledWith({}, ['xyzzy', 'plugh']);
    });

    describe('which wraps a component with modular CSS', () => {
        const styles = {
            [`foo${ELEMENT_SEPARATOR}bar`]: 'foo#123',
            [`foo${ELEMENT_SEPARATOR}bar${MODIFIER_SEPARATOR}quux`]: 'quux#456'
        };

        it('should use class names mapping from from component`s context', () => {
            const WrappedBar = element(
                'bar',
                ({baz}) => baz
            )(Bar);
            renderer.render(<WrappedBar baz="quux" />, {
                blockName: 'foo',
                blockStyles: styles
            });
            const wrappedFooBar = renderer.getRenderOutput();
            expect(wrappedFooBar.props.className).toBe('foo#123 quux#456');
        });

        it('should use class names mapping from [options] which is passed as third arg', () => {
            const WrappedBar = element(
                'bar',
                ({baz}) => baz,
                {styles} // options
            )(Bar);
            renderer.render(<WrappedBar baz="quux" />, {blockName: 'foo'});
            const wrappedFooBar = renderer.getRenderOutput();
            expect(wrappedFooBar.props.className).toBe('foo#123 quux#456');
        });

        it('should use class names mapping from [options] which is passed as second arg', () => {
            const WrappedBar = element(
                'bar',
                {styles} // options
            )(Bar);
            renderer.render(<WrappedBar />, {blockName: 'foo'});
            const wrappedFooBar = renderer.getRenderOutput();
            expect(wrappedFooBar.props.className).toBe('foo#123');
        });
    });

    it('should support DOM components decoration', () => {
        const WrappedBar = element('bar')('div');
        renderer.render(<WrappedBar />, {blockName: 'foo'});
        const wrappedFooBar = renderer.getRenderOutput();
        expect(wrappedFooBar.type).toBe('div');
        expect(wrappedFooBar.props.className).toBe(`foo${ELEMENT_SEPARATOR}bar`);
    });

    it('should declare [displayName] containing element name', () => {
        const WrappedBar = element('bar')(Bar);
        expect(WrappedBar.displayName).toBe('element(bar)');
    });

    it('should fail in case of empty context', () => {
        const WrappedBar = element('bar')(Bar);
        expect(() => renderer.render(<WrappedBar />)).toThrow(/^\[BEM\].+/);
    });
});
