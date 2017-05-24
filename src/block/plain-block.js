import React from 'react';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import classNames from 'classnames/bind';
import {assertNamePart, assertComponentName} from '../bem-naming-validators';
import {createBlockNameFactory} from '../bem-naming-factory';

/**
 * Simplified version of @block decorator.
 * Support of @element and @modifier is disabled
 * due to performance reasons (life cycle and context).
 * But interface is very similar to @block.
 * So you can use it with "renaming". For example:
 * import {plainBlock as block} from '@redneckz/react-bem-helper';
 */
export function plainBlock(blockName, mapPropsToModifiers = noop, {styles} = {}) {
    if (isPlainObject(mapPropsToModifiers)) {
        const options = mapPropsToModifiers;
        return plainBlock(blockName, noop, options);
    }
    assertNamePart(blockName);
    if (!isFunction(mapPropsToModifiers)) {
        throw new TypeError('[mapPropsToModifiers] should be a function');
    }
    return (WrappedComponent) => {
        if (isFunction(WrappedComponent)) {
            assertComponentName(WrappedComponent, blockName);
            WrappedComponent.displayName = blockName; // eslint-disable-line no-param-reassign
        }
        const cx = classNames.bind(WrappedComponent.styles || styles || {});
        function BlockWrapper(props) {
            const {className} = props;
            const modifiers = mapPropsToModifiers(props);
            const blockNameFactory = createBlockNameFactory(blockName);
            const blockClassName = cx(
                blockNameFactory(),
                modifiers && blockNameFactory(modifiers),
                className
            );
            return React.createElement(WrappedComponent, {
                ...props,
                className: blockClassName
            });
        }
        BlockWrapper.displayName = `block(${blockName})`;
        return BlockWrapper;
    };
}
