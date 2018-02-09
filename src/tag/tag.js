import React from 'react';
import {pick} from '../utils';

/**
 * Since react@15.2.0 there is new mechanism for handling unknown props.
 * This factory function provides straighforward way to define React DOM component
 * with restricted list of attributes (whitelist)
 *
 * @param {string} tagName
 * @param {Object} [attrs] plain object with allowed attributes and their default values
 * @returns {React.Component} DOM component
 */
export function tag(tagName, attrs = {}) {
    const prune = pick(Object.keys(attrs));
    function Tag({
        key, className, children, ...props
    }) {
        return React.createElement(
            tagName,
            {
                key,
                className,
                ...attrs,
                ...prune(props)
            },
            children
        );
    }
    Tag.displayName = `tag(${tagName})`;
    return Tag;
}

export const div = attrs => tag('div', attrs);
export const span = attrs => tag('span', attrs);

export const form = attrs => tag('form', attrs);
export const button = attrs => tag('button', {
    type: 'button', onClick: () => {}, ...attrs
});
export const input = attrs => tag('input', {
    type: 'text', name: '', value: '', ...attrs
});
export const label = attrs => tag('label', {
    htmlFor: '', ...attrs
});
export const textarea = attrs => tag('textarea', {
    name: '', rows: 2, ...attrs
});
