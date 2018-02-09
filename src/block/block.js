import React from 'react';
import {Config} from '../config';
import {baseBlock} from './base-block';
import {blockContextTypes} from './block-context-types';

/**
 * Decorator to declare BEM blocks. Injects computed [className] and [modifiers].
 * Also context is used to share block name, block modifiers and block styles with elements.
 * So BEM elements can be declared separately from block.
 *
 * But be careful using this technique. For example:
 *
 * import {block, element} from '@redneckz/react-bem-helper';
 *
 * const BlockA = block('block-a')(() => (
 *     <BlockB>
 *         <ElementA /> {/* Erroneously bound to BlockB /}
 *         <ElementB /> {/* Correctly bound to BlockA /}
 *     </BlockB>
 * ));
 * const ElementA = element('element-a')('div'); // Component context
 * const ElementB = BlockA.element('element-b')('div'); // Static context
 *
 * @param {string} blockName
 * @param {Props -> Modifiers} [mapPropsToModifiers]
 * @param {{styles: Object}} [options]
 * @return {Component -> Component} decorator to declare blocks
 */
export function block(blockName, mapPropsToModifiers, options) {
    if (typeof mapPropsToModifiers === 'object') {
        // Alternative signature
        return block(blockName, undefined, mapPropsToModifiers);
    }
    const base = baseBlock(blockName, mapPropsToModifiers, options);
    const {styles} = options || {};
    return (BlockComponent) => {
        const BlockWrapper = base(
            class extends Config.COMPONENT_BASE_CLASS {
                getChildContext() {
                    return {
                        blockName,
                        blockModifiers: this.props.modifiers,
                        blockStyles: styles
                    };
                }
                render() {
                    return React.createElement(BlockComponent, this.props);
                }
            }
        );
        Object.assign(BlockComponent, {
            element: BlockWrapper.element
        });
        BlockWrapper.displayName = `block-with-context(${blockName})`;
        BlockWrapper.childContextTypes = blockContextTypes;
        return BlockWrapper;
    };
}
