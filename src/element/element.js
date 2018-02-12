import React from 'react';
import {classNamesList} from '../utils';
import {elementClassNames} from '../bem-naming-factory';
import {blockContextTypes} from '../block/block-context-types';

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
    return (ElementComponent) => {
        function ElementWrapper(props, {blockName, blockModifiers = '', blockStyles} = {}) {
            const {className} = props;
            const modifiers = classNamesList()(
                mapPropsToModifiers(props, classNamesList()(blockModifiers))
            );
            return React.createElement(ElementComponent, {
                ...props,
                className: classNamesList(styles || (staticContext.blockStyles || blockStyles))(
                    elementClassNames(staticContext.blockName || blockName, elementName)(modifiers),
                    className // BEM mixin
                ).join(' '),
                'data-modifiers': modifiers.join(' ')
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
