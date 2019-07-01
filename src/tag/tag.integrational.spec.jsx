// @flow
import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactTestRenderer from 'react-test-renderer';
import { block } from '../block';
import { createBlockContext } from '../create-block-context';
import { div } from './tag';

describe('DOM components produced by "tag" factory and wrapped by BEM block decorator', () => {
  it('should filter attributes by means of whitelist', () => {
    const WrappedFoo = block(createBlockContext({ name: 'foo' }))()(div({ role: 'separator' }));
    const renderer = ReactTestRenderer.create(<WrappedFoo quux xyzzy />);
    const wrappedFoo = renderer.toJSON() || {};
    expect(wrappedFoo.type).toBe('div');
    expect(wrappedFoo.props).toEqual({ className: 'foo', role: 'separator' });
  });
});
