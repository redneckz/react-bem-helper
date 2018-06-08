// @flow
import { pick, kebabToCamelCase } from '../utils';
import { BEMConfig } from '../bem-config';

export function modifiersListToModifiersMap(modifiersList?: string[] | void | null): Object => any {
    if (!modifiersList || modifiersList.length === 0) {
        return () => {};
    }
    return props => [
        booleanModifiersListToModifiersMap(modifiersList || [])(props),
        enumerableModifiersListToModifiersMap(modifiersList || [])(props),
    ];
}

function booleanModifiersListToModifiersMap(modifiersList: string[]): Object => any {
    const booleanModifiers = modifiersList.filter(mod => !isEnumerableModifier(mod));
    const booleanProps = booleanModifiers.map(kebabToCamelCase);
    return pick(booleanProps);
}

function enumerableModifiersListToModifiersMap(modifiersList: string[]): Object => any {
    const enumerableModifiers = modifiersList.filter(isEnumerableModifier);
    const enumerableProps = enumerableModifiers
        .map(pair => pair.split(BEMConfig.MODIFIER_SEPARATOR))
        .map(([mod]) => mod)
        .map(kebabToCamelCase);
    return props =>
        Object.assign(
            {},
            ...enumerableProps.map(
                key =>
                    props[key] && {
                        [`${key}${BEMConfig.MODIFIER_SEPARATOR}${props[key]}`]: true,
                    },
            ),
        );
}

function isEnumerableModifier(mod: string): boolean {
    return mod.indexOf(BEMConfig.MODIFIER_SEPARATOR) > 0;
}
