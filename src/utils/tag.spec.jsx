import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import isFunction from 'lodash/isFunction';
import {tag, div, span, form, button, input, label, textarea} from './tag';

describe('[tag] factory function', () => {
    let renderer;
    beforeEach(() => {
        renderer = new ReactShallowRenderer();
    });

    it('should return functional component', () => {
        expect(isFunction(tag('foo'))).toBeTruthy();
    });

    it('should create DOM component with provided tag name', () => {
        const tagName = 'foo';
        const Foo = tag(tagName);
        renderer.render(<Foo />);
        const foo = renderer.getRenderOutput();
        expect(foo.type).toEqual(tagName);
    });

    it('should create DOM component with provided attributes', () => {
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

    it('should restrict DOM component props according to provided attributes', () => {
        const attrs = {
            id: 'bar',
            lang: 'ru',
            title: 'Bar'
        };
        const Foo = tag('foo', attrs);
        renderer.render(<Foo quux="quux" />);
        const foo = renderer.getRenderOutput();
        expect(foo.props).toEqual(attrs);
    });

    describe('[div]', () => {
        it('should return functional component', () => {
            expect(isFunction(div())).toBeTruthy();
        });

        it('should produce "div"', () => {
            const Div = div();
            renderer.render(<Div />);
            expect(renderer.getRenderOutput().type).toEqual('div');
        });
    });

    describe('[span]', () => {
        it('should return functional component', () => {
            expect(isFunction(span())).toBeTruthy();
        });

        it('should produce "span"', () => {
            const Span = span();
            renderer.render(<Span />);
            expect(renderer.getRenderOutput().type).toEqual('span');
        });
    });

    describe('[form]', () => {
        it('should return functional component', () => {
            expect(isFunction(form())).toBeTruthy();
        });

        it('should produce "form"', () => {
            const Form = form();
            renderer.render(<Form />);
            expect(renderer.getRenderOutput().type).toEqual('form');
        });
    });

    describe('[button]', () => {
        it('should return functional component', () => {
            expect(isFunction(button())).toBeTruthy();
        });

        it('should produce "button" with attribute "type" equal to "button" and attribute "onClick"', () => {
            const Button = button();
            renderer.render(<Button />);
            const out = renderer.getRenderOutput();
            expect(out.type).toEqual('button');
            expect(out.props.type).toEqual('button');
            expect(out.props.onClick).toBeTruthy();
        });
    });

    describe('[input]', () => {
        it('should return functional component', () => {
            expect(isFunction(input())).toBeTruthy();
        });

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
        it('should return functional component', () => {
            expect(isFunction(label())).toBeTruthy();
        });

        it('should produce "label" with "htmlFor" attribute', () => {
            const Label = label();
            renderer.render(<Label />);
            const out = renderer.getRenderOutput();
            expect(out.type).toEqual('label');
            expect(out.props.htmlFor).toEqual('');
        });
    });

    describe('[textarea]', () => {
        it('should return functional component', () => {
            expect(isFunction(textarea())).toBeTruthy();
        });

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
