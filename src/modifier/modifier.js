export function modifier(...modifierPredicates) {
    if (modifierPredicates.length === 0) {
        throw new TypeError('At least one modifier predicate should be provided');
    }
    const adjustedModifierPredicates = modifierPredicates.map(adjustModifierPredicate);
    return (ModifierComponent) => {
        // eslint-disable-next-line no-param-reassign
        ModifierComponent.modifierPredicates = adjustedModifierPredicates;
        return ModifierComponent;
    };
}

function adjustModifierPredicate(predicate) {
    if (predicate instanceof Function) {
        return predicate;
    } else if (typeof predicate === 'string') {
        return normalizedModifiers => normalizedModifiers[predicate];
    } else if (predicate instanceof RegExp) {
        return normalizedModifiers => Object.keys(normalizedModifiers)
            .some(mod => predicate.test(mod));
    }
    throw new TypeError('Modifier predicate should be function, string or regexp');
}
