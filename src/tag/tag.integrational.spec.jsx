import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {plainBlock} from '../block';
import {div} from './tag';

describe('DOM components produced by "tag" factory and wrapped by BEM block decorator', () => {
    it('should filter attributes by means of whitelist', () => {
        const WrappedFoo = plainBlock('foo')(div({role: 'separator'}));
        const renderer = ReactTestRenderer.create(<WrappedFoo quux xyzzy />);
        const wrappedFoo = renderer.toJSON();
        expect(wrappedFoo.type).toEqual('div');
        expect(wrappedFoo.props).toEqual({className: 'foo', role: 'separator'});
    });
});
