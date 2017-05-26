import React from 'react';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import classNames from 'classnames/bind';
import {assertNamePart, assertComponentName} from '../bem-naming-validators';
import {createBlockNameFactory} from '../bem-naming-factory';
import {blockMixin} from './block-mixin';

/**
 * Simplified version of @block decorator.
 * Support of standalone @element is disabled due to performance reasons
 * (see https://facebook.github.io/react/docs/context.html).
 * But its interface is very similar to @block.
 * So it can be used as follows (with "renaming"):
 * import {plainBlock as block} from '@redneckz/react-bem-helper';
 *
 * Use namespaced @element instead of standalone @element. For example:
 * const Foo = plainBlock('foo')('div');
 * const Bar = Foo.element('bar')('div');
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
    const staticContext = {blockName, blockStyles: styles};
    return (WrappedComponent) => {
        if (isFunction(WrappedComponent)) {
            assertComponentName(WrappedComponent, blockName);
            blockMixin(staticContext, WrappedComponent);
            // eslint-disable-next-line no-param-reassign
            WrappedComponent.displayName = blockName;
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
        return blockMixin(staticContext, BlockWrapper);
    };
}
