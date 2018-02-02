import React from 'react';
import classNames from 'classnames/bind';
import {Config} from '../config';
import {createBlockNameFactory} from '../bem-naming-factory';
import {blockContextTypes} from './block-context-types';
import {chooseModifierComponent} from '../modifier';
import {blockMixin} from './block-mixin';

const {COMPONENT_BASE_CLASS} = Config;

/**
 * @param {string} blockName
 * @param {Props -> Modifiers} [mapPropsToModifiers]
 * @param {{styles: string}} [options]
 * @return {Component -> Component} decorator to declare blocks
 */
export function block(blockName, mapPropsToModifiers = () => {}, options = {}) {
    if (typeof mapPropsToModifiers === 'object') {
        // Alternative signature
        return block(blockName, undefined, mapPropsToModifiers);
    }
    const {styles} = options;
    const staticContext = {blockName, blockStyles: styles};
    return (...WrappedComponents) => {
        WrappedComponents
            .filter(Wrapped => Wrapped instanceof Function)
            .forEach(prepareWrappedComponent(blockName, staticContext));
        const cx = classNames.bind(styles || {});
        const BlockWrapper = blockMixin(staticContext, class extends COMPONENT_BASE_CLASS {
            getChildContext() {
                const modifiers = mapPropsToModifiers(this.props);
                return {
                    blockName,
                    blockModifiers: classNames(modifiers),
                    blockStyles: styles
                };
            }

            render() {
                const {className} = this.props;
                const modifiers = mapPropsToModifiers(this.props);
                const blockNameFactory = createBlockNameFactory(blockName);
                const blockClassName = cx(
                    blockNameFactory(),
                    modifiers && blockNameFactory(modifiers),
                    className
                );
                const TargetComponent = chooseModifierComponent(
                    WrappedComponents,
                    modifiers
                );
                return React.createElement(TargetComponent, {
                    ...this.props,
                    className: blockClassName
                });
            }
        });
        BlockWrapper.displayName = `block(${blockName})`;
        BlockWrapper.childContextTypes = blockContextTypes;
        return BlockWrapper;
    };
}

function prepareWrappedComponent(blockName, staticContext) {
    return (Wrapped) => {
        blockMixin(staticContext, Wrapped);
        // eslint-disable-next-line no-param-reassign
        Wrapped.displayName = blockName;
    };
}
