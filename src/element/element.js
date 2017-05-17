import React from 'react';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames/bind';
import {assertNamePart, assertComponentName, assertModifierComponentName} from '../bem-naming-validators';
import {createElementNameFactory} from '../bem-naming-factory';
import {blockContextTypes} from '../block';
import {
    chooseModifierComponent, getDefaultComponent,
    normalizeModifiers
} from '../modifier';

export function element(elementName, mapPropsToModifiers = noop, {styles} = {}) {
    assertNamePart(elementName);
    if (!isFunction(mapPropsToModifiers)) {
        throw new TypeError('[mapPropsToModifiers] should be a function');
    }
    return (...WrappedComponents) => {
        WrappedComponents.filter(isFunction).forEach((Wrapped) => {
            assertModifierComponentName(Wrapped.name, elementName);
            Wrapped.displayName = elementName; // eslint-disable-line no-param-reassign
        });
        const DefaultComponent = getDefaultComponent(WrappedComponents);
        assertComponentName(DefaultComponent.name, elementName);
        function Wrapper(props, {blockName, blockModifiers, blockStyles} = {}) {
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
        Wrapper.displayName = `element(${elementName})`;
        Wrapper.contextTypes = blockContextTypes;
        return Wrapper;
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
