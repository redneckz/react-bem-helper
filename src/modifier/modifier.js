import React from 'react';

/**
 * Decorator to define components bound to particular modifiers
 *
 * @typedef {string} Modifier
 *
 * @param {Array(Modifier) -> boolean} predicate
 * @param {Component} ModifiedComponent
 */
export function modifier(predicate, ModifiedComponent) {
    if (typeof predicate !== 'function') {
        throw new TypeError('Please specify modifier predicate');
    }
    if (typeof ModifiedComponent !== 'function') {
        throw new TypeError('Please specify modified component');
    }
    return (DefaultComponent) => {
        function Wrapper(props) {
            const {'data-modifiers': modifiers} = props; // Comes from block or element decorators
            const modifiersList = modifiers ? modifiers.split(' ') : [];
            return React.createElement(
                predicate(modifiersList) ? ModifiedComponent : DefaultComponent,
                props
            );
        }
        Wrapper.displayName = `modifier(${DefaultComponent.displayName || DefaultComponent.name})`;
        return Wrapper;
    };
}
