import React from 'react';
import {Config} from '../config';
import {plainBlock} from './plain-block';

Config.ASSERTION_ENABLED = true;

describe('BEM plain block decorator', () => {
    let Foo;
    beforeEach(() => {
        Foo = () => <div />;
    });

    it('should provide "namespaced" BEM element decorator', () => {
        const WrappedFoo = plainBlock('foo')(Foo);
        expect(Foo.element).toBeInstanceOf(Function);
        expect(WrappedFoo.element).toBeInstanceOf(Function);
    });
});
