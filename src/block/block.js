import React from 'react';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames/bind';
import {assertNamePart, assertComponentName} from '../bem-naming-validators';
import {createBlockNameFactory} from '../bem-naming-factory';
import {blockContextTypes} from './block-context-types';
import {chooseModifierComponent, getDefaultComponent} from '../modifier';

export function block(blockName, mapPropsToModifiers = noop, {styles} = {}) {
    assertNamePart(blockName);
    if (!isFunction(mapPropsToModifiers)) {
        throw new TypeError('[mapPropsToModifiers] should be a function');
    }
    return (...WrappedComponents) => {
        WrappedComponents.forEach((Wrapped) => {
            assertComponentName(Wrapped.name, blockName);
            Wrapped.displayName = blockName; // eslint-disable-line no-param-reassign
        });
        const DefaultComponent = getDefaultComponent(WrappedComponents);
        const cx = classNames.bind(DefaultComponent.styles || styles || {});
        return class Wrapper extends React.PureComponent {
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
                    className: blockClassName,
                    blockClassName
                });
            }
        };
    };
}
