import pick from 'lodash/pick';
import keys from 'lodash/keys';
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
    function Tag({className, children, ...props}) {
        return createElement(
            tagName,
            {
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

export const div = attrs => tag('div', attrs);
export const span = attrs => tag('span', attrs);
export const input = attrs => tag('input', attrs);
export const button = attrs => tag('button', attrs);
