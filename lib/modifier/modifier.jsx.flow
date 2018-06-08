// @flow
import React from 'react';
import type { Component } from '../bem-helper-types';
import type { ModifierPredicate } from './modifier-predicates';

/**
 * Decorator to define components bound to particular modifiers
 */
export function modifier<Props: { 'data-modifiers'?: string }>(
    predicate: ModifierPredicate,
    ModifiedComponent: string | Component<Props>,
): (Component<Props>) => Component<Props> {
    if (typeof predicate !== 'function') {
        throw new TypeError('Please specify modifier predicate');
    }
    if (typeof ModifiedComponent !== 'function') {
        throw new TypeError('Please specify modified component');
    }
    return (DefaultComponent) => {
        function Wrapper(props: Props) {
            const { 'data-modifiers': modifiers } = props; // Comes from block or element decorators
            const modifiersList = modifiers ? modifiers.split(' ') : [];
            const ActualComponent = predicate(modifiersList) ? ModifiedComponent : DefaultComponent;
            return <ActualComponent {...props} />;
        }
        Wrapper.displayName = `modifier(${DefaultComponent.displayName || DefaultComponent.name})`;
        return Wrapper;
    };
}
