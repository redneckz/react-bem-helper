// @flow
import React from 'react';
import type { DOMComponent } from '../bem-helper-types';
import { pick, stringifyBooleanProps } from '../utils';

const KNOWN_KEYS = ['key', 'className', 'children'];

/**
 * Since react@15.2.0 there is new mechanism for handling unknown props.
 * This factory function provides straighforward way to define React DOM component
 * with restricted list of attributes (whitelist)
 */
export function tag(tagName: string): <Attrs: {}>(attrs?: Attrs) => DOMComponent<Attrs> {
    return (attrs = {}) => {
        const whitelist = KNOWN_KEYS.concat(Object.keys(attrs));
        const prune = pick(whitelist);
        const Tag = props =>
            React.createElement(tagName, {
                ...attrs,
                ...prune(stringifyBooleanProps(props)),
            });
        Tag.displayName = `tag(${tagName})`;
        return Tag;
    };
}

export const div = tag('div');
export const span = tag('span');

export const form = tag('form');

export const button = <Attrs: {}>(attrs?: Attrs): DOMComponent<Attrs> =>
    tag('button')({
        type: 'button',
        onClick: () => {},
        ...attrs,
    });

export const input = <Attrs: {}>(attrs?: Attrs): DOMComponent<Attrs> =>
    tag('input')({
        type: 'text',
        name: '',
        value: '',
        onChange: () => {},
        onFocus: () => {},
        onBlur: () => {},
        ...attrs,
    });

export const label = <Attrs: {}>(attrs?: Attrs): DOMComponent<Attrs> =>
    tag('label')({
        htmlFor: '',
        ...attrs,
    });

export const textarea = <Attrs: {}>(attrs?: Attrs): DOMComponent<Attrs> =>
    tag('textarea')({
        name: '',
        rows: 2,
        onChange: () => {},
        ...attrs,
    });
