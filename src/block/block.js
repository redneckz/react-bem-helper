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
import {blockMixin} from './block-mixin';

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
    const staticContext = {blockName, blockStyles: styles};
    return (...WrappedComponents) => {
        WrappedComponents
            .filter(isFunction)
            .forEach(prepareWrappedComponent(blockName, staticContext));
        const DefaultComponent = getDefaultComponent(WrappedComponents);
        assertComponentName(DefaultComponent, blockName);
        const cx = classNames.bind(DefaultComponent.styles || styles || {});
        const BlockWrapper = blockMixin(staticContext, class extends COMPONENT_BASE_CLASS {
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
        });
        BlockWrapper.displayName = `block(${blockName})`;
        BlockWrapper.childContextTypes = blockContextTypes;
        return BlockWrapper;
    };
}

function prepareWrappedComponent(blockName, staticContext) {
    return (Wrapped) => {
        assertModifierComponentName(Wrapped, blockName);
        blockMixin(staticContext, Wrapped);
        // eslint-disable-next-line no-param-reassign
        Wrapped.displayName = blockName;
    };
}
