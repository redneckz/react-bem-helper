import React from 'react';
import {block} from './block';

describe('BEM block decorator', () => {
    let Foo;
    beforeEach(() => {
        Foo = () => <div />;
    });

    it('should provide BEM element decorator bound to block', () => {
        const WrappedFoo = block('foo')(Foo);
        expect(Foo.element).toBeInstanceOf(Function);
        expect(WrappedFoo.element).toBeInstanceOf(Function);
    });
});
