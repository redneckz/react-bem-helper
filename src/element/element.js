import React from 'react';
import classNames from 'classnames/bind';
import {createElementNameFactory} from '../bem-naming-factory';
import {blockContextTypes} from '../block/block-context-types';
import {
    chooseModifierComponent, getDefaultComponent,
    normalizeModifiers
} from '../modifier';

/**
 * @param {string} elementName
 * @param {Props -> Modifiers} [mapPropsToModifiers]
 * @param {{styles: string}} [options]
 * @return {Component -> Component} decorator to declare elements
 */
export function element(elementName, mapPropsToModifiers = () => {}, options = {}) {
    if (typeof mapPropsToModifiers === 'object') {
        // Alternative signature
        return element(elementName, undefined, mapPropsToModifiers);
    }
    const {styles} = options;
    const staticContext = this || {}; // @block static context
    return (...WrappedComponents) => {
        WrappedComponents
            .filter(Wrapped => Wrapped instanceof Function)
            .forEach(prepareWrappedComponent(elementName));
        const DefaultComponent = getDefaultComponent(WrappedComponents);
        function ElementWrapper(props, {blockName, blockModifiers, blockStyles} = {}) {
            const {className} = props;
            const modifiers = mapPropsToModifiers(props, normalizeModifiers(blockModifiers));
            const cx = classNames.bind(
                DefaultComponent.styles || styles ||
                (staticContext.blockStyles || blockStyles) ||
                {}
            );
            const elementNameFactory = createElementNameFactory(
                staticContext.blockName || blockName,
                elementName
            );
            const elementClassName = cx(
                elementNameFactory(),
                modifiers && elementNameFactory(modifiers),
                className
            );
            const TargetComponent = chooseModifierComponent(
                WrappedComponents,
                modifiers
            );
            return React.createElement(TargetComponent, {
                ...props,
                className: elementClassName
            });
        }
        ElementWrapper.displayName = `element(${elementName})`;
        if (!staticContext.blockName) {
            ElementWrapper.contextTypes = blockContextTypes;
        }
        return ElementWrapper;
    };
}

/**
 * Create props to modifiers transducer
 * transparently applying all block modifiers to element
 */
export function transparent(mapPropsToModifiers = () => {}) {
    return (props, blockModifiers) => [
        mapPropsToModifiers(props),
        blockModifiers
    ];
}

function prepareWrappedComponent(elementName) {
    return (Wrapped) => {
        Wrapped.displayName = elementName; // eslint-disable-line no-param-reassign
    };
}
