import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import {Config} from '../config';
import {element} from './element';
import {modifier} from '../modifier';

Config.ASSERTION_ENABLED = true;

describe('BEM element decorator with separate modifier components', () => {
    let renderer;
    let Bar;
    let BarXyzzy;
    let BarPlugh;
    beforeEach(() => {
        renderer = new ReactShallowRenderer();
        Bar = () => <div />;
        BarXyzzy = () => <div />;
        BarPlugh = () => <div />;
    });

    it('should choose component according to modifier', () => {
        const WrappedBar = element(
            'bar',
            ({xyzzy, plugh}) => [{xyzzy}, `plugh-${plugh}`]
        )(
            Bar,
            modifier('xyzzy')(BarXyzzy),
            modifier(/^plugh-\w\w$/)(BarPlugh)
        );
        renderer.render(<WrappedBar />, {blockName: 'foo'});
        let wrappedBar = renderer.getRenderOutput();
        expect(wrappedBar.type).toBe(Bar);
        renderer.render(<WrappedBar xyzzy />, {blockName: 'foo'});
        wrappedBar = renderer.getRenderOutput();
        expect(wrappedBar.type).toBe(BarXyzzy);
        renderer.render(<WrappedBar plugh="xs" />, {blockName: 'foo'});
        wrappedBar = renderer.getRenderOutput();
        expect(wrappedBar.type).toBe(BarPlugh);
    });
});
