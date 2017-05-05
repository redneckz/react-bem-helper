import partition from 'lodash/partition';
import find from 'lodash/find';
import {normalizeModifiers} from './modifiers-normalizer';

export function chooseModifierComponent(Components = [], mappedModifiers = {}) {
    const [ModifierComponents, [DefaultComponent]] = partition(Components, 'modifierPredicates');
    const normModifiers = normalizeModifiers(mappedModifiers);
    const chosenComponents = ModifierComponents.filter(ModifierComponent => ModifierComponent
        .modifierPredicates.some(predicate => predicate(normModifiers)));
    if ((chosenComponents.length === 0) && DefaultComponent) {
        return DefaultComponent;
    }
    assertChosenComponents(chosenComponents, normModifiers);
    return chosenComponents[0];
}

export function getDefaultComponent(Components = []) {
    return find(Components, Component => !Component.modifierPredicates);
}

function assertChosenComponents(chosenComponents, normalizedModifiers) {
    if (!chosenComponents || (chosenComponents.length === 0)) {
        throw new Error(`Unsupported modifier provided: ${JSON.stringify(normalizedModifiers)}`);
    } else if (chosenComponents.length > 1) {
        throw new Error(`Modifier components conflict: ${JSON.stringify(normalizedModifiers)}`);
    }
}
