import React from 'react';
import {baseBlock} from './base-block';

describe('BEM base block decorator', () => {
    let Foo;
    beforeEach(() => {
        Foo = () => <div />;
    });

    it('should provide BEM element decorator bound to block', () => {
        const WrappedFoo = baseBlock('foo')(Foo);
        expect(Foo.element).toBeInstanceOf(Function);
        expect(WrappedFoo.element).toBeInstanceOf(Function);
    });
});
