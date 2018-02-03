import React from 'react';
import {classNamesList} from '../utils';
import {blockClassNames} from '../bem-naming-factory';
import {element} from '../element';

/**
 * @param {string} blockName
 * @param {Props -> Modifiers} [mapPropsToModifiers]
 * @param {{styles: Object}} [options]
 * @return {Component -> Component} decorator to declare blocks
 */
export function baseBlock(blockName, mapPropsToModifiers = () => {}, options = {}) {
    const {styles} = options;
    const mixin = staticContextMixin({blockName, blockStyles: styles});
    return (BlockComponent) => {
        mixin(BlockComponent);
        function BaseBlockWrapper(props) {
            const {className} = props;
            const modifiers = classNamesList()(mapPropsToModifiers(props));
            return React.createElement(BlockComponent, {
                ...props,
                className: classNamesList(styles)(
                    blockClassNames(blockName)(modifiers),
                    className // BEM mixin
                ).join(' '),
                modifiers: modifiers.join(' ')
            });
        }
        BaseBlockWrapper.displayName = `block(${blockName})`;
        return mixin(BaseBlockWrapper);
    };
}

/**
 * Mixins decorator to declare elements. Decorator is bound to block`s static context.
 * So underlying elements are bound to particular block name and block styles.
 *
 * @param {{blockName: string, blockStyles: Object}} staticContext
 * @return {ComponentType -> ComponentType} mixin
 */
function staticContextMixin(staticContext) {
    return BlockComponent => (
        (BlockComponent instanceof Function)
            ? Object.assign(BlockComponent, {
                element: element.bind(staticContext)
            })
            : BlockComponent
    );
}
