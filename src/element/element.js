import React from 'react';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import negate from 'lodash/negate';
import classNames from 'classnames/bind';
import {assertNamePart, assertComponentName, assertModifierComponentName} from '../bem-naming-validators';
import {createElementNameFactory} from '../bem-naming-factory';
import {blockContextTypes, isBlockDefinition} from '../block';
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
    return (...WrappedComponents) => {
        // Don't assert DOM components (tag names) and BEM mixins
        WrappedComponents.filter(isFunction).filter(negate(isMixin)).forEach((Wrapped) => {
            assertModifierComponentName(Wrapped, elementName);
            Wrapped.displayName = elementName; // eslint-disable-line no-param-reassign
        });
        const DefaultComponent = getDefaultComponent(WrappedComponents);
        if (!isMixin(DefaultComponent)) {
            assertComponentName(DefaultComponent, elementName);
        }
        function ElementWrapper(props, {blockName, blockModifiers, blockStyles} = {}) {
            const {className} = props;
            const modifiers = mapPropsToModifiers(props, normalizeModifiers(blockModifiers));
            const cx = classNames.bind(DefaultComponent.styles || styles || blockStyles || {});
            const elementNameFactory = createElementNameFactory(blockName, elementName);
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
        ElementWrapper.contextTypes = blockContextTypes;
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

function isMixin(WrappedComponent) {
    return isBlockDefinition(WrappedComponent);
}
