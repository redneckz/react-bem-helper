import React from 'react';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';
import zipObject from 'lodash/zipObject';
import classNames from 'classnames/bind';
import {assertNamePart} from '../bem-naming-validators';
import {createElementNameFactory} from '../bem-naming-factory';
import {blockContextTypes} from '../block';

export function element(elementName, mapPropsToModifiers = noop) {
    assertNamePart(elementName);
    if (!isFunction(mapPropsToModifiers)) {
        throw new TypeError('[mapPropsToModifiers] should be a function');
    }
    return (WrappedComponent) => {
        const cx = classNames.bind(WrappedComponent.styles || {});
        function Wrapper(props, {blockName, blockModifiers} = {}) {
            const {className} = props;
            const modifiers = mapPropsToModifiers(props, normalizeBlockModifiers(blockModifiers));
            const elementNameFactory = createElementNameFactory(blockName, elementName);
            const elementClasses = cx(
                elementNameFactory(),
                modifiers && elementNameFactory(modifiers),
                className
            );
            return <WrappedComponent {...props} elementClasses={elementClasses} />;
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

function normalizeBlockModifiers(blockModifiers) {
    if (!blockModifiers) {
        return {};
    }
    const blockModifiersList = blockModifiers.split(' ');
    return zipObject(blockModifiersList, blockModifiersList);
}
