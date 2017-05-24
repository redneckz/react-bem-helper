import pick from 'lodash/pick';
import keys from 'lodash/keys';
import noop from 'lodash/noop';
import {createElement} from 'react';
import {disableAssertionOnTarget} from './assertion';

/**
 * Since react@15.2.0 there is new mechanism for handling components unknown props.
 * This factory function provides straighforward way to define React DOM component
 * with restricted list of attributes
 *
 * @param {string} tagName
 * @param {Object} [attrs = {}] plain object with allowed attributes and their default values
 * @returns {React.Component} DOM component
 */
export function tag(tagName, attrs = {}) {
    function Tag({key, className, children, ...props}) {
        return createElement(
            tagName,
            {
                key,
                className,
                ...attrs,
                ...pick(props, keys(attrs))
            },
            children
        );
    }
    Tag.displayName = `tag(${tagName})`;
    disableAssertionOnTarget(Tag);
    return Tag;
}

// Meta tags
export const div = attrs => tag('div', attrs);
export const span = attrs => tag('span', attrs);

// Form tags
export const form = attrs => tag('form', attrs);
export const button = attrs => tag('button', {
    type: 'button', onClick: noop, ...attrs
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
