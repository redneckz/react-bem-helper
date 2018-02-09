import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import {tag, div, span, form, button, input, label, textarea} from './tag';

describe('[tag] factory function', () => {
    let renderer;
    beforeEach(() => {
        renderer = new ReactShallowRenderer();
    });

    it('should create DOM component with provided tag name', () => {
        const tagName = 'foo';
        const Foo = tag(tagName);
        renderer.render(<Foo />);
        const foo = renderer.getRenderOutput();
        expect(foo.type).toBe(tagName);
    });

    it('should create DOM component with default attributes from whitelist', () => {
        const attrs = {
            id: 'bar',
            lang: 'ru',
            title: 'Bar'
        };
        const Foo = tag('foo', attrs);
        renderer.render(<Foo />);
        const foo = renderer.getRenderOutput();
        expect(foo.props).toEqual(attrs);
    });

    it('should restrict DOM component props according to whitelist', () => {
        const attrs = {
            id: 'bar',
            lang: 'ru',
            title: 'Bar'
        };
        const Foo = tag('foo', attrs);
        renderer.render(<Foo id="123" lang="en" quux="quux" />);
        const foo = renderer.getRenderOutput();
        expect(foo.props).toEqual({
            ...attrs,
            id: '123',
            lang: 'en'
            // quux is out of the whitelist
        });
    });

    describe('[div]', () => {
        it('should produce "div"', () => {
            const Div = div();
            renderer.render(<Div />);
            expect(renderer.getRenderOutput().type).toEqual('div');
        });
    });

    describe('[span]', () => {
        it('should produce "span"', () => {
            const Span = span();
            renderer.render(<Span />);
            expect(renderer.getRenderOutput().type).toEqual('span');
        });
    });

    describe('[form]', () => {
        it('should produce "form"', () => {
            const Form = form();
            renderer.render(<Form />);
            expect(renderer.getRenderOutput().type).toEqual('form');
        });
    });

    describe('[button]', () => {
        it('should produce "button" with attribute "type" equal to "button" and attribute "onClick"', () => {
            const Button = button();
            renderer.render(<Button />);
            const out = renderer.getRenderOutput();
            expect(out.type).toEqual('button');
            expect(out.props.type).toEqual('button');
            expect(out.props.onClick).toBeDefined();
        });
    });

    describe('[input]', () => {
        it('should produce "input" with attributes "type", "name", "value"', () => {
            const Input = input();
            renderer.render(<Input />);
            const out = renderer.getRenderOutput();
            expect(out.type).toEqual('input');
            expect(out.props).toEqual({
                type: 'text',
                name: '',
                value: ''
            });
        });
    });

    describe('[label]', () => {
        it('should produce "label" with "htmlFor" attribute', () => {
            const Label = label();
            renderer.render(<Label />);
            const out = renderer.getRenderOutput();
            expect(out.type).toEqual('label');
            expect(out.props.htmlFor).toEqual('');
        });
    });

    describe('[textarea]', () => {
        it('should produce "textarea" with empty "name" and "rows" attribute equal to 2 (HTML5 spec)', () => {
            const Textarea = textarea();
            renderer.render(<Textarea />);
            const out = renderer.getRenderOutput();
            expect(out.type).toEqual('textarea');
            expect(out.props).toEqual({
                name: '',
                rows: 2 // HTML5 spec
            });
        });
    });
});
