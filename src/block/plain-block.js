import React from 'react';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import classNames from 'classnames/bind';
import {assertNamePart, assertComponentName} from '../bem-naming-validators';
import {createBlockNameFactory} from '../bem-naming-factory';
import {blockMixin} from './block-mixin';

/**
 * Alternative block decorator. Very similar to @block.
 * React context API (see https://facebook.github.io/react/docs/context.html)
 * is disabled and replaced with static context. This leads to deprivation of
 * standalone @element support.
 * Use namespaced @element instead. For example:
 *
 * import {plainBlock as block} from '@redneckz/react-bem-helper';
 *
 * const Foo = block('foo')('div');
 * const Bar = Foo.element('bar')('div');
 *
 * Also namespaced @element can be used with standart @block
 * in complicated cases like the following:
 *
 * const BlockA = block('block-a')(() => (
 *     <BlockB>
 *         <ElementA />
 *         <ElementB />
 *     </BlockB>
 * ));
 * const ElementA = element('element-a')('div');        // standalone @element
 * const ElementB = BlockA.element('element-b')('div'); // namespaced @element
 *
 * ElementA is erroneously bound to BlockB. ElementB works just fine.
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
