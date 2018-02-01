import React from 'react';
import classNames from 'classnames/bind';
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
 *
 * @param {string} blockName
 * @param {Props -> Modifiers} [mapPropsToModifiers]
 * @param {{styles: string}} [options]
 * @return {Component -> Component} decorator
 */
export function plainBlock(blockName, mapPropsToModifiers = () => {}, options = {}) {
    if (typeof mapPropsToModifiers === 'object') {
        // Alternative signature
        return plainBlock(blockName, undefined, mapPropsToModifiers);
    }
    const {styles} = options;
    const staticContext = {blockName, blockStyles: styles};
    return (WrappedComponent) => {
        if (WrappedComponent instanceof Function) {
            prepareWrappedComponent(blockName, staticContext)(WrappedComponent);
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

function prepareWrappedComponent(blockName, staticContext) {
    return (Wrapped) => {
        blockMixin(staticContext, Wrapped);
        // eslint-disable-next-line no-param-reassign
        Wrapped.displayName = blockName;
    };
}
