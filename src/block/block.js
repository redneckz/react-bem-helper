import React from 'react';
import {Config} from '../config';
import {baseBlock} from './base-block';
import {blockContextTypes} from './block-context-types';

/**
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
