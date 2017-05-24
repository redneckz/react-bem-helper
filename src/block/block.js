import React from 'react';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import classNames from 'classnames/bind';
import {Config} from '../config';
import {assertNamePart, assertComponentName, assertModifierComponentName} from '../bem-naming-validators';
import {createBlockNameFactory} from '../bem-naming-factory';
import {blockContextTypes} from './block-context-types';
import {chooseModifierComponent, getDefaultComponent} from '../modifier';

const {COMPONENT_BASE_CLASS} = Config;

export function block(blockName, mapPropsToModifiers = noop, {styles} = {}) {
    if (isPlainObject(mapPropsToModifiers)) {
        const options = mapPropsToModifiers;
        return block(blockName, noop, options);
    }
    assertNamePart(blockName);
    if (!isFunction(mapPropsToModifiers)) {
        throw new TypeError('[mapPropsToModifiers] should be a function');
    }
    return (...WrappedComponents) => {
        WrappedComponents.filter(isFunction).forEach((Wrapped) => {
            assertModifierComponentName(Wrapped, blockName);
            Wrapped.displayName = blockName; // eslint-disable-line no-param-reassign
        });
        const DefaultComponent = getDefaultComponent(WrappedComponents);
        assertComponentName(DefaultComponent, blockName);
        const cx = classNames.bind(DefaultComponent.styles || styles || {});
        return class BlockWrapper extends COMPONENT_BASE_CLASS {
            static displayName = `block(${blockName})`;

            static childContextTypes = blockContextTypes;

            getChildContext() {
                const modifiers = mapPropsToModifiers(this.props);
                return {
                    blockName,
                    blockModifiers: classNames(modifiers),
                    blockStyles: DefaultComponent.styles || styles
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
        };
    };
}

export function isBlockDefinition(Component) {
    return Component && /^block\(.+\)$/.test(Component.displayName);
}
