import React from 'react';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames/bind';
import {assertNamePart, assertComponentName} from '../bem-naming-validators';
import {createBlockNameFactory} from '../bem-naming-factory';
import {blockContextTypes} from './block-context-types';

export function block(blockName, mapPropsToModifiers = noop) {
    assertNamePart(blockName);
    if (!isFunction(mapPropsToModifiers)) {
        throw new TypeError('[mapPropsToModifiers] should be a function');
    }
    return (WrappedComponent) => {
        assertComponentName(WrappedComponent.name, blockName);
        WrappedComponent.displayName = blockName; // eslint-disable-line no-param-reassign
        const cx = classNames.bind(WrappedComponent.styles || {});
        return class Wrapper extends React.PureComponent {
            static displayName = `block(${blockName})`;

            static childContextTypes = blockContextTypes;

            getChildContext() {
                const modifiers = mapPropsToModifiers(this.props);
                return {
                    blockName,
                    blockModifiers: classNames(modifiers),
                    blockStyles: WrappedComponent.styles
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
                return <WrappedComponent {...this.props} blockClassName={blockClassName} />;
            }
        };
    };
}
