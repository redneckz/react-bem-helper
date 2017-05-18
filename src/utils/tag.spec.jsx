import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import isFunction from 'lodash/isFunction';
import {tag} from './tag';

describe('"tag" factory function', () => {
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
});
