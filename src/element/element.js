import React from 'react';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import classNames from 'classnames/bind';
import {assertNamePart, assertComponentName, assertModifierComponentName} from '../bem-naming-validators';
import {createElementNameFactory} from '../bem-naming-factory';
import {blockContextTypes} from '../block/block-context-types';
import {isBEMComponent} from '../utils';
import {
    chooseModifierComponent, getDefaultComponent,
    normalizeModifiers
} from '../modifier';

export function element(elementName, mapPropsToModifiers = noop, {styles} = {}) {
    if (isPlainObject(mapPropsToModifiers)) {
        const options = mapPropsToModifiers;
        return element(elementName, noop, options);
    }
    assertNamePart(elementName);
    if (!isFunction(mapPropsToModifiers)) {
        throw new TypeError('[mapPropsToModifiers] should be a function');
    }
    const staticContext = this || {}; // @block static context
    return (...WrappedComponents) => {
        WrappedComponents
            .filter(isFunction)
            .forEach(prepareWrappedComponent(elementName));
        const DefaultComponent = getDefaultComponent(WrappedComponents);
        if (!isBEMComponent(DefaultComponent)) {
            assertComponentName(DefaultComponent, elementName);
        }
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
export function transparent(mapPropsToModifiers = noop) {
    return (props, blockModifiers) => [
        mapPropsToModifiers(props),
        blockModifiers
    ];
}

function prepareWrappedComponent(elementName) {
    return (Wrapped) => {
        // Don't assert DOM components (tag names) and BEM mixins
        if (!isBEMComponent(Wrapped)) {
            assertModifierComponentName(Wrapped, elementName);
        }
        Wrapped.displayName = elementName; // eslint-disable-line no-param-reassign
    };
}
