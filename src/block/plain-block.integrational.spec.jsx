import React from 'react';
import isFunction from 'lodash/isFunction';
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
        expect(isFunction(Foo.element)).toBeTruthy();
        expect(isFunction(WrappedFoo.element)).toBeTruthy();
    });
});
